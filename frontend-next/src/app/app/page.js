"use client";
// System Imports
import { useState, useEffect } from "react";

// Dependencies
import { useGeolocated } from "react-geolocated";

// Firebase Imports
import { auth, database } from "../../../firebase-config";
import { ref, onValue } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth"

// Component Imports
import { Header } from "../../components/app/header";
import { HomePage } from "../../components/app/page/home";
import { Sidebar } from "../../components/app/sidebar/home";

/**
* Contains most everything for the app homepage
* @returns {Object} Home Page
*/
function Home() {
  // State variables for app page
  const [user, setUser] = useState(null); // user data
  const [loadingLoc, setLoadingLoc] = useState(true); // location variable loading, true = loading, false = finished loading
  const [authUser] = useAuthState(auth) // auth user object (used to obtain other user object)

  // Authentication Verification / Redirection if Profile Data not Filled out
  useEffect(() => {
    if (authUser) {
        onValue(ref(database, `users/${authUser.uid}`), (userData) => {
            userData = userData.val();
            if (userData) {
                setUser(userData);
            } else {
                window.location.href = "/onboarding";
            }
        });
    }
  }, [authUser])

  // Gets current location
  const { coords } = useGeolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  // If theres a location, go ahead and show location based stuff
  useEffect(() => {
    if (coords) {
        setLoadingLoc(false);
    }
  }, [coords])

  return (
    <div>
      {user && (
        <div className="grid grid-cols-4 auto-cols-max overflow-hidden">
          {/* Left Side of Page */}
          <div className="col-span-3 h-dvh">
            {/* Header */}
            <Header
              mainTab={"home"}
              user={user}
            />
            {/* Main Page Section */}
            <div className="mr-2 h-[calc(100%-110px)]">
              {!loadingLoc && (
                <HomePage loc={coords} user={user} />
              )}
              {loadingLoc && (
                <HomePage loc={null} user={user} />
              )}
            </div>
          </div>
          {/* Sidebar (Right Side of Page) */}
            <Sidebar
              user={user}
              location={coords}
              loadingLoc={loadingLoc}
            />
        </div>
      )}
    </div>
  );
}

export default Home;

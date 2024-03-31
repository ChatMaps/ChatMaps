"use client";
// System Imports
import { useState, useEffect } from "react";
import { auth, database } from "../../../firebase-config";
import { ref, onValue, set, remove, get } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth"
import { useGeolocated } from "react-geolocated";

// Refactored Component Imports
// Data Structure Imports
import { Member } from "../../components/app/datatypes";

// Header Import
import { Header } from "../../components/app/header";

// Main Tab Imports
import { MainTabHome } from "../../components/app/main_tab/home";

// Sidebar Imports
import { Home_Sidebar } from "../../components/app/sidebar/home";

// Contains most everything for the app homepage
function Home() {
  // It's time to document and change these awful variable names
  // State variables for app page
  const [user, setUser] = useState(null);
  const [mainTab, setMainTab] = useState("home"); // Primary tab
  const [loadingLoc, setLoadingLoc] = useState(true); // location variable loading, true = loading, false = finished loading
  const [authUser, loading] = useAuthState(auth)

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

  const { coords } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

  useEffect(() => {
    console.log(coords)
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
              {mainTab == "home" && !loadingLoc && (
                <MainTabHome loc={coords} user={user} />
              )}
              {mainTab == "home" && loadingLoc && (
                <MainTabHome loc={null} user={user} />
              )}
            </div>
          </div>
          {/* Sidebar (Right Side of Page) */}
            <Home_Sidebar
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

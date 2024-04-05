"use client";
// System Imports
import { useState, useEffect } from "react";

// Dependencies
import { useGeolocated } from "react-geolocated";
import Drawer from '@mui/material/Drawer';

// Firebase Imports
import { auth, database } from "../../../firebase-config";
import { ref, onValue } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth"

// Component Imports
import { Header } from "../../components/app/header";
import { HomePage } from "../../components/app/page/home";
import { Sidebar } from "../../components/app/sidebar/home";
import {useWindowSize} from "../../components/app/datatypes";

/**
* Contains most everything for the app homepage
* @returns {Object} Home Page
*/
function Home() {
  // State variables for app page
  const [user, setUser] = useState(null); // user data
  const [loadingLoc, setLoadingLoc] = useState(true); // location variable loading, true = loading, false = finished loading
  const [authUser] = useAuthState(auth) // auth user object (used to obtain other user object)
  const [drawerOpen, setDrawerOpen] = useState(true); // drawer open state

  var windowSize = useWindowSize()
  useEffect(() => {
    if (windowSize.width < 767) {
      setDrawerOpen(false)
    } else {
      setDrawerOpen(true)
    }
  }, [windowSize])

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
    <div className="overflow-hidden h-dvh">
      {user && (
        <div className="overflow-hidden h-dvh">
          {/* Left Side of Page */}
          <div className="overflow-hidden h-dvh md:mr-[405px]">
            {/* Header */}
            <Header
              mainTab={"home"}
              user={user}
              sidebarControl={() => {setDrawerOpen(!drawerOpen)}}
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
          <Drawer open={drawerOpen} anchor={"right"} variant={windowSize.width > 767? "persistent": "temporary"} onClose={() => {setDrawerOpen(false)}} sx={{
          width: 400,
          marginTop: 10,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 400,
            borderLeft: 0,
          },
          }}>
            <div className="shadow-2xl">
              <Sidebar user={user} location={coords} loadingLoc={loadingLoc}/>
            </div>
          </Drawer>
        </div>
      )}
    </div>
  );
}

export default Home;

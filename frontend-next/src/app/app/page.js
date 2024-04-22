"use client";
// System Imports
import { useState, useEffect } from "react";

// Dependencies
import Drawer from '@mui/material/Drawer';

// Firebase Imports
import { auth, database } from "../../../firebase-config";
import { ref, get, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth"

// Component Imports
import { Header } from "../../components/app/header";
import { HomePage } from "../../components/app/page/home";
import { Sidebar } from "../../components/app/sidebar/home";
import {useWindowSize} from "../../components/app/datatypes";

// Capacitor Import
import { Geolocation } from '@capacitor/geolocation';

/**
* Contains most everything for the app homepage
* @returns {Object} Home Page
*/
function Home() {
  // State variables for app page
  const [user, setUser] = useState(null); // user data
  const [loadingLoc, setLoadingLoc] = useState(true); // location variable loading, true = loading, false = finished loading
  const [authUser, authLoading] = useAuthState(auth) // auth user object (used to obtain other user object)
  const [drawerOpen, setDrawerOpen] = useState(true); // drawer open state
  const [coords, setCoords] = useState(null)

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
    if (authUser && authLoading === false) {
        get(ref(database, `users/${authUser.uid}`)).then((userData) => {
            userData = userData.val();
            if (userData) {
                setUser({...userData});
            } else {
                window.location.href = "/onboarding";
            }
        });
    } else if (authLoading === false) {
        window.location.href = "/login";
    }
  }, [authLoading])

  useEffect(() => {
    Geolocation.getCurrentPosition().then((position) => {
      setCoords(position.coords);
      setLoadingLoc(false);
    });
  }, [])

  // Saves users last loc to profile for friends map
  useEffect(() => {
    if (coords && user) {
      set(ref(database,`users/${user.uid}/location`), {
        latitude: coords.latitude,
        longitude: coords.longitude
      })
    }
  }, [coords, user])

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
          width: windowSize.width > 767? 400: "80%",
          marginTop: 10,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: windowSize.width > 767? 400: "80%",
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

"use client";
// System Imports
import Drawer from '@mui/material/Drawer';
import { useState, useEffect } from "react";

// Firebase Imports
import { auth, database } from "../../../firebase-config";
import { ref, onValue, set, onDisconnect  } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth"

// Component Imports
import { Header } from "../../components/app/header";
import { DMRoom } from "../../components/app/friends/page";
import { Sidebar } from "../../components/app/sidebar/dm";
import {useWindowSize} from "../../components/app/datatypes";


/**
 * DM Page
 * @returns {Object} Chat Page
 */
function Chat() {
  // State variables for chat page
  const [user, setUser] = useState(null); // user data
  const [chatRoomObj, setChatRoomObj] = useState(null); // Current chatroom object
  const [doneLoading, setDoneLoading] = useState(false) // is the page done loading or not
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

  // Users URL params to load proper chatroom, then logs the user into that room
  useEffect(() => {
    if (user) {
        const searchParams = new URLSearchParams(document.location.search);
        var path = searchParams.get("dm")

        /*// Send entered message
        var payload = {
            body: "entered",
            user: user.username,
            isSystem: true,
            timestamp: new Date().getTime(),
            uid: user.uid,
        };
        set(
            ref(
            database,
            `/rooms/${path}/chats/${new Date().getTime()}-${user.username}`
            ),
            payload
        );*/

        // Add user to online for room
        set(ref(database, `/dms/${path}/users/online/${user.uid}`), user)

        // Removes user from room on disconnect (reload, window close, internet lost)
        onDisconnect(ref(database, `/dms/${path}/users/online/${user.uid}`)).remove()

        // Sends leaving message on disconnect (Timestamp function used due to new onDisconnect stuff)
        /*someRef = ref(database, `/rooms/${path}/chats/${new Date().getTime()}-${user.username}`)
        onDisconnect(someRef).set({
          body: "left",
          user: user.username,
          isSystem: true,
          timestamp: serverTimestamp(),
          uid: user.uid,
        })*/

        onValue(ref(database, `/dms/${path}`), (roomData) => {
            roomData = roomData.val();
            setChatRoomObj(roomData)
            if (!doneLoading) {
                setDoneLoading(true)
            }
        })
    }
  }, [user]);

  return (
    <div>
      {(authUser && doneLoading) && (
        <div className="overflow-hidden h-dvh">
          {/* Left Side of Page */}
          <div className="overflow-hidden h-dvh md:mr-[400px]">
            {/* Header */}
            <Header
              mainTab={"dm"}
              chatRoomObj={chatRoomObj}
              user={user}
              sidebarControl={() => {setDrawerOpen(!drawerOpen)}}
            />
            {/* Main Page Section */}
            <div className="mr-2 h-[calc(100%-110px)]">
                <DMRoom roomObj={chatRoomObj} user={user} />
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
              <Sidebar chatRoomObj={chatRoomObj} user={user}/>
            </div>
          </Drawer>
        </div>
      )}
    </div>
  );
}

export default Chat;
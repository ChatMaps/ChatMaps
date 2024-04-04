"use client";
// System Imports
import { useState, useEffect } from "react";

// Firebase Imports
import { auth, database } from "../../../firebase-config";
import { ref, onValue, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth"

// Component Imports
import { Header } from "../../components/app/header";
import { ChatRoom } from "../../components/app/page/chat";
import { Sidebar } from "../../components/app/sidebar/chat";

/**
 * Chat Page
 * @returns {Object} Chat Page
 */
function Chat() {
  // State variables for chat page
  const [user, setUser] = useState(null); // user data
  const [chatRoomObj, setChatRoomObj] = useState(null); // Current chatroom object
  const [doneLoading, setDoneLoading] = useState(false) // is the page done loading or not
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

  // Users URL params to load proper chatroom, then logs the user into that room
  useEffect(() => {
    if (user) {
        const searchParams = new URLSearchParams(document.location.search);
        var path = searchParams.get("room")

        // Send entered message
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
        );

        onValue(ref(database, `/rooms/${path}`), (roomData) => {
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
        <div className="grid grid-cols-4 auto-cols-max overflow-hidden">
          {/* Left Side of Page */}
          <div className="col-span-3 h-dvh">
            {/* Header */}
            <Header
              mainTab={"chat"}
              chatRoomObj={chatRoomObj}
              user={user}
            />
            {/* Main Page Section */}
            <div className="mr-2 h-[calc(100%-110px)]">
                <ChatRoom roomObj={chatRoomObj} user={user} />
            </div>
          </div>
          {/* Sidebar (Right Side of Page) */}
            <Sidebar
              chatRoomObj={chatRoomObj}
            />
        </div>
      )}
    </div>
  );
}

export default Chat;
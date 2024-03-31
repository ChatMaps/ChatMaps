"use client";
// System Imports
import { useState, useEffect } from "react";
import { auth, database } from "../../../firebase-config";
import { ref, onValue, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth"

// Header Import
import { Header } from "../../components/app/header";

// Main Tab Imports
import { MainTabChatRoom } from "../../components/app/main_tab/chat";

// Sidebar Imports
import { Chat_Sidebar } from "../../components/app/sidebar/chat";

// Contains most everything for the app homepage
function Home() {
  // It's time to document and change these awful variable names
  // State variables for app page
  const [user, setUser] = useState(null);
  const [chatRoomObj, setChatRoomObj] = useState(null); // Current chatroom object
  const [doneLoading, setDoneLoading] = useState(false)
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
                <MainTabChatRoom roomObj={chatRoomObj} user={user} />
            </div>
          </div>
          {/* Sidebar (Right Side of Page) */}
            <Chat_Sidebar
              chatRoomObj={chatRoomObj}
              chatroomUsersLoading={false}
            />
        </div>
      )}
    </div>
  );
}

export default Home;
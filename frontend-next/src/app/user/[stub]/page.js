"use client";
// System Imports
import { useState, useEffect } from "react";
import { auth, database } from "../../api/firebase-config";
import { ref, onValue, get } from "firebase/database";
import {Marker} from "pigeon-maps";
import {onAuthStateChanged} from "firebase/auth"

// Refactored Component Imports
// Data Structure Imports
 import { Interest } from "../../../components/app/datatypes";

// Header Import
import { Header } from "../../../components/app/header";

// Contains most everything for the app homepage
function Home({ params }) {
  // It's time to document and change these awful variable names
  // State variables for app page
  const [myRoomsObj, setMyRoomsObj] = useState(null); // My Rooms Object
  const [profileData, setProfileData] = useState(null)
  const [isAuthenticated, setAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [userInterestArray, setUserInterestArray] = useState(null)

  const [isOwner, setOwn] = useState(false)

  // Authentication
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        get(ref(database, `users/${user.uid}`))
        .then((userData) => {
          userData = userData.val()
          if (userData) {
            if (userData.uid == params.stub) {
              setOwn(true)
            }
            setUser(userData)
            setAuth(true)
          } else {
            window.location.href = "/onboarding"
          }
          
        })
      } else {
        setAuth(false)
        window.location.href = "/login"
      }
      })
  }, [])

  // Grabs profile user data
  useEffect(() => {
          onValue(ref(database, "/users/" + params.stub), (snapshot) => {
            setProfileData(snapshot.val());
            var interests = snapshot.val().interests || null;
            interests = interests.split(",");
            var interestArray = []
            var i = 0
            for (var interest in interests) {
                if (i < 4)
                    interestArray.push(<Interest interest={interests[interest]}/>)
                i++;
            }
            setUserInterestArray(interestArray)
            var rooms = snapshot.val().rooms;
            setMyRoomsObj(rooms);
          });
  },[]);

  return (
    <div>
      {isAuthenticated && (
        <div className="overflow-hidden">
          {/* Left Side of Page */}
          <div className="h-dvh overflow-hidden">
            {/* Header */}
            <Header user={user}/>
            {/* Main Page Section */}
            <div className="grid grid-cols-3 mr-2 h-[calc(100%-110px)] pl-5 pr-5 pt-2">

              <div className="bg-white shadow-2xl rounded-xl pt-5">
                <img src={profileData.pfp} width="300px" className="relative mx-auto rounded-2xl overflow-hidden"/>
                <div className="font-bold text-[30px]">
                    {profileData.firstName} {profileData.lastName}
                </div>
                <div className="text-[20px]">@{profileData.username}</div>
                <div className="pt-5">{profileData.bio}</div>
                <div className="grid grid-cols-3 p-3">
                {userInterestArray}
                </div>
                <div className="grid grid-cols-1 auto-cols-min justify-items-center">
                {isOwner && ( <a className="w-[120px] p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full text-center"> Edit Profile </a> )}
                {!isOwner && ( <a className="w-[120px] p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full text-center"> Add Friend </a> )}
                </div>
              </div>
              <div className="cols-span-2">
                Feed
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
  );
}

export default Home;
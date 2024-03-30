"use client";
// System Imports
import { useState, useEffect } from "react";
import { auth, database, storage } from "../../../../firebase-config";
import { ref, onValue, get, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

// Refactored Component Imports

// Data Structure Imports
import { ProfileRoom } from "../../../components/app/profile/ProfileRoom";
import { ProfileEdit } from "../../../components/app/profile/ProfileEdit";
import { Interest } from "../../../components/app/profile/Interest";

// Header Import
import { Header } from "../../../components/app/header";

// Contains most everything for the app homepage
function Home({ params }) {
  // It's time to document and change these awful variable names
  // State variables for app page
  const [profileData, setProfileData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userInterestArray, setUserInterestArray] = useState(null);
  const [userRoomsArray, setUserRoomsArray] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  //Handles Edit State in Component, shares useState with ProfileEdit
  const handleIsEditing = (newValue) => {
    setIsEditing(newValue);
  };

  // Authentication
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        get(ref(database, `users/${user.uid}`)).then((userData) => {
          userData = userData.val();
          if (userData) {
            if (userData.uid == params.stub) {
              setIsOwner(true);
            }
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            window.location.href = "/onboarding";
          }
        });
      } else {
        setIsAuthenticated(false);
        window.location.href = "/login";
      }
    });
  }, []);

  // Grabs profile user data
  useEffect(() => {
    onValue(ref(database, "/users/" + params.stub), (snapshot) => {
      setProfileData(snapshot.val());
      var interests = snapshot.val().interests || null;
      if (interests == null) {
        // Placeholder for no interests specified, will be replaced with default interests
        interests = "Music, Sports, Movies";
      }
      interests = interests.split(",");
      var interestArray = [];
      var i = 0;
      for (var interest in interests) {
        if (i < 4)
          interestArray.push(<Interest interest={interests[interest]} />);
        i++;
      }
      setUserInterestArray(interestArray);
      var rooms = snapshot.val().rooms;
      var roomArray = [];
      for (var room in rooms) {
        roomArray.push(<ProfileRoom room={rooms[room]} />);
      }
      setUserRoomsArray(roomArray);
    });
  }, []);

  return (
    <div>
      {isAuthenticated && (
        <div className="overflow-hidden">
          {/* Left Side of Page */}
          <div className="h-dvh overflow-hidden">
            {/* Header */}
            <Header user={user} />
            {/* Main Page Section */}
            <div className="grid grid-cols-3 mr-2 h-[calc(100%-110px)] pl-5 pr-5 pt-2">
              <div className="cols-span-1 bg-white shadow-2xl rounded-xl pt-5">
                {!isEditing && (
                  <div>
                    <img
                      src={profileData.pfp}
                      width="300px"
                      className="relative mx-auto rounded-2xl overflow-hidden"
                    />
                    <div className="font-bold text-[30px]">
                      {profileData.firstName} {profileData.lastName}
                    </div>
                    <div className="text-[20px]">@{profileData.username}</div>
                    <div className="pt-5">{profileData.bio}</div>
                    <div className="grid grid-cols-3 p-3">
                      {userInterestArray}
                    </div>
                    <div className="grid grid-cols-1 auto-cols-min justify-items-center">
                      {isOwner && (
                        <a
                          onClick={() => {
                            setIsEditing(true);
                          }}
                          className="w-[120px] p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full text-center"
                        >
                          {" "}
                          Edit Profile{" "}
                        </a>
                      )}
                      {!isOwner && (
                        <a className="w-[120px] p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full text-center">
                          {" "}
                          Add Friend{" "}
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {isEditing && (
                  <ProfileEdit profileData={profileData} user={user} onSave={handleIsEditing}/>
                )}
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-3 gap-y-1 pl-5 gap-1 h-[100%] w-[100%]">
                  {userRoomsArray}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

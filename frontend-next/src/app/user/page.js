"use client";
// System Imports
import { useState, useEffect } from "react";
import { auth, database } from "../../../firebase-config";
import { ref, onValue } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth"


// Refactored Component Imports

// Data Structure Imports
import { ProfileRoom } from "../../components/app/profile/ProfileRoom";
import { ProfileEdit } from "../../components/app/profile/ProfileEdit";
import { Interest } from "../../components/app/profile/Interest";

// Header Import
import { Header } from "../../components/app/header";

// Friend Import
import { addFriend } from "../../components/app/friends/friends";

// Icons
import CircleIcon from '@mui/icons-material/Circle';

/**
 * User Profile Page
 * @returns {Object} - User Profile Page
 */
function UserProfile() {
  const [profileData, setProfileData] = useState(null); // Profile Data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Determines if user is authenticated
  const [user, setUser] = useState(null); // User Data
  const [userInterestArray, setUserInterestArray] = useState(null); // Array of user's interests
  const [userRoomsArray, setUserRoomsArray] = useState(null); // Array of user's rooms
  const [isOwner, setIsOwner] = useState(false); // Determines if user is owner of profile
  const [friends, setFriends] = useState(false); // is user a friend?
  const [isPending, setPending] = useState(false); // is friend request pending?
  const [authUser, authLoading] = useAuthState(auth) // auth user object (used to obtain other user object)


  // Handles Edit State in Component, shares useState with ProfileEdit
  const [isEditing, setIsEditing] = useState(false);
  const handleIsEditing = (newValue) => {
    setIsEditing(newValue);
  };

  // Authentication
  useEffect(() => {
    if (authUser && authLoading === false) {
      const searchParams = new URLSearchParams(document.location.search);
      var userUID = searchParams.get("uid")
      onValue(ref(database, `users/${authUser.uid}`), (userData) => {
          userData = userData.val();
          if (userData) {
            if (userData.uid == userUID) {
              setIsOwner(true);
            }
            setIsAuthenticated(true);
            setUser(userData);
          } else {
              window.location.href = "/onboarding";
          }
      });
    } else if (authLoading === false) {
        window.location.href = "/login";
    }
  }, [authLoading]);

  // Grabs profile user data
  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    var userUID = searchParams.get("uid")
    onValue(ref(database, "/users/" + userUID), (snapshot) => {
      setProfileData(snapshot.val());

      // Populates array with user's interests
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
          interestArray.push(<Interest interest={interests[interest]} key={interest}/>);
        i++;
      }
      setUserInterestArray(interestArray);

      // Populates array with user's rooms
      var rooms = snapshot.val().rooms;
      var roomArray = [];
      for (var room in rooms) {
        roomArray.push(<ProfileRoom room={rooms[room]} key={room}/>);
      }
      setUserRoomsArray(roomArray);
    });
  }, []);

  useEffect(() => {
    if (user && profileData) {
      if ("friends" in user) {
        profileData.uid in user.friends.friends ? setFriends(true) : setFriends(false);
      }
      if ("friends" in profileData) {
        if ("requests" in profileData.friends)  {
          user.uid in profileData.friends.requests ? setPending(true) : setPending(false);
        }
      }
    }
  }, [user, profileData]);

  return (
    <div>
      {(isAuthenticated && profileData) && (
        <div className="md:overflow-hidden">
          {/* Left Side of Page */}
          <div className="h-dvh md:overflow-hidden">
            {/* Header */}
            <Header user={user} mainTab={"profile"} />
            {/* Main Page Section */}
            <div className="md:grid md:grid-cols-3 mr-2 h-[calc(100%-110px)] pl-5 pr-5 pt-2 max-md:mb-10">
              <div className="cols-span-1 bg-white shadow-2xl rounded-xl pt-5 max-md:pb-5">
                {!isEditing && (
                  <div>
                    <img
                      src={profileData.pfp}
                      className="relative mx-auto rounded-2xl overflow-hidden max-h-[20%] max-w-[70%]"
                    />
                    <div className="font-bold text-[30px] flex justify-center items-center">
                      {profileData.lastOnline == true && <CircleIcon className="text-lime-600 mr-3"/>}{profileData.firstName} {profileData.lastName}
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
                          Edit Profile
                        </a>
                      )}
                      {(!isOwner && !friends) && (
                        <div>
                          {(!isPending ) && (<a onClick={() => {addFriend(user, profileData.uid);setPending(true)}} className="w-[120px] p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full text-center">Add Friend</a>)}
                          {(isPending ) && (<a className="w-[120px] p-2 bg-cyan-500 text-white font-bold rounded-full text-center">Pending</a>)}  
                        </div>
                      )}
                      {(!isOwner && friends ) && (<div className="font-bold text-[20px]">Friends</div>)}
                    </div>
                  </div>
                )}
                {isEditing && (
                  <ProfileEdit
                    profileData={profileData}
                    user={user}
                    onSave={handleIsEditing}
                  />
                )}
              </div>
              <div className="col-span-2">
                <div className="h-dvh pb-20 overflow-auto grid md:grid-cols-3 max-md:grid-cols-1 max-md:mt-5 md:pl-5 justify-items-center gap-y-5 gap-1 w-[100%]">
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

export default UserProfile;

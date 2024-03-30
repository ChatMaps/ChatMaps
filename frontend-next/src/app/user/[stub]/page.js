"use client";
// System Imports
import { useState, useEffect } from "react";
import { auth, database, storage } from "../../../../firebase-config";
import { ref, onValue, get, update  } from "firebase/database";
import { ref as sRef, getDownloadURL  } from "firebase/storage";
import {onAuthStateChanged} from "firebase/auth"
import { useForm, Form } from "react-hook-form";

// Refactored Component Imports
// Data Structure Imports
 import { Interest, ProfileRoom } from "../../../components/app/datatypes";

// Header Import
import { Header } from "../../../components/app/header";
import { uploadBytes } from "firebase/storage";

// Contains most everything for the app homepage
function Home({ params }) {
  // It's time to document and change these awful variable names
  // State variables for app page
  const [profileData, setProfileData] = useState(null)
  const [isAuthenticated, setAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [userInterestArray, setUserInterestArray] = useState(null)
  const [userRoomsArray, setUserRoomsArray] = useState(null)
  const [isOwner, setOwn] = useState(false)
  const [isEditing, setEdit] = useState(false)

  var { register, control} = useForm()

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
            var roomArray = []
            for (var room in rooms) {
              roomArray.push(<ProfileRoom room={rooms[room]}/>)
            }
            setUserRoomsArray(roomArray);
          });
  },[]);

  function save({data}) {
    if (data.pfp[0]) {
      // image stuff
      uploadBytes(sRef(storage, `users/${user.uid}/pfp`), data.pfp[0]).then(() => {
        getDownloadURL(sRef(storage, `users/${user.uid}/pfp`)).then((url) => {
          data.pfp = url
          for (var key in data) {
            if (data[key] == "") {
              data[key] = profileData[key]
            }
          }
      
          setEdit(false)
          update(ref(database, `users/${user.uid}`), data)
        })
      })
    } else {
      for (var key in data) {
        if (data[key] == "") {
          data[key] = profileData[key]
        }
      }
      data.pfp = profileData.pfp  
      setEdit(false)
      update(ref(database, `users/${user.uid}`), data)
    }
  }

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

              <div className="cols-span-1 bg-white shadow-2xl rounded-xl pt-5">
                {!isEditing && (
                  <div>
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
                    {isOwner && ( <a onClick={() => {setEdit(true)}} className="w-[120px] p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full text-center"> Edit Profile </a> )}
                    {!isOwner && ( <a className="w-[120px] p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full text-center"> Add Friend </a> )}
                    </div>
                  </div>
                )}
                {isEditing && (
                  <div>
                      <Form onSubmit={save} encType={'application/json'} control={control}>
                        <div className="grid grid-cols-2">
                          <div>
                            <img src={profileData.pfp} width="150px" className="relative mx-auto rounded-2xl overflow-hidden"/>
                            Current Profile Picture
                          </div>
                          <div className="flex content-center">
                            <input type="file" {...register("pfp")} className="w-[80%]" accept=".jpg,.png,.jpeg"/>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 pl-2 w-[90%]">
                          <div className="pt-5">
                            <div className="font-bold">First Name</div>
                            <input className="w-[80%] border-2 border-gray-300 p-2 rounded-lg" type="text" {...register("firstName")} placeholder={profileData.firstName}/>
                          </div>
                          <div className="pt-5">
                            <div className="font-bold">Last Name</div>
                            <input className="w-[80%] border-2 border-gray-300 p-2 rounded-lg" type="text" {...register("lastName")} placeholder={profileData.lastName}/>
                          </div>
                          <div className="pt-5">
                            <div className="font-bold">Username</div>
                            <input className="w-[80%] border-2 border-gray-300 p-2 rounded-lg" type="text" {...register("username")} placeholder={profileData.username}/>
                          </div>
                          <div className="pt-5">
                            <div className="font-bold">Interests (Comma Seperated)</div>
                            <input className="w-[80%] border-2 border-gray-300 p-2 rounded-lg" type="text" {...register("interests")} placeholder={profileData.interests}/>
                          </div>
                          <div className="pt-5 col-span-2">
                            <div className="font-bold">Bio</div>
                            <textarea className="w-[92%] border-2 border-gray-300 p-2 rounded-lg"  {...register("bio")} type="text" placeholder={profileData.bio}/>
                          </div>
                          <div className="justify-items-center pt-5 col-span-2">
                            <button type="submit" className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full text-center"> Save Changes </button>
                          </div>
                        </div>
                      </Form>
                  </div>
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
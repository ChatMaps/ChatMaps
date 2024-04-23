import { Member } from "../datatypes"

import { database } from "../../../../firebase-config"
import {ref, get} from "firebase/database"

import { useState, useEffect } from "react"

export function Sidebar({user, chatRoomObj}) {
  const [profileData, setProfileData] = useState(null)
  const [chatroomOnline, setChatroomOnline] = useState(null)

  useEffect(() => {
    if (chatRoomObj.users && chatRoomObj.users.online) {
      var activeUsers = []
      for (var activeUser in chatRoomObj.users.online)
        activeUsers.push(<Member memberObj={chatRoomObj.users.online[activeUser]} key={activeUser} />);
    }
    setChatroomOnline(activeUsers)
  }, [chatRoomObj])
    useEffect(() => {
        if (user) {
            // Profile Information
            if (user.uid == chatRoomObj.UIDs[0]) {
                var profileUID = chatRoomObj.UIDs[1]
            } else {
                var profileUID = chatRoomObj.UIDs[0]
            }

            get(ref(database, `users/${profileUID}`)).then((snapshot) => {
                var profileData = snapshot.val()
                setProfileData(profileData)
            })
        }
    }, [user])
  
    return (
      <div>
        {profileData && (
        <div className="overflow-hidden h-dvh">
            <div className="m-2 h-[98%] grid grid-cols-1">
                <div className="flex place-content-center">
                    <div className="bg-white rounded-lg m-2 shadow-2xl pt-10">
                        <img src={profileData.pfp} style={{maxHeight: "800px"}} className="w-[80%] relative mx-auto"/> 
                        <div className="font-bold text-[24px]">{profileData.firstName} {profileData.lastName}</div>
                        @{profileData.username}
                    </div>
                </div>
                <div className="bg-white rounded-lg m-2 shadow-2xl">
                <div>In The Chat</div>
                {chatroomOnline}
                </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
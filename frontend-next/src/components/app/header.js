// System Imports
import Link from "next/link"

// Firebase Imports
import { database } from "../../../firebase-config";
import { ref, set, remove } from "firebase/database";

// Component Imports
import { NotificationPanel } from "./notifications/notifications";
import { ProfilePanel } from "./profile/ProfilePanel"

/**
 * Closes Open Chat Room
 * @param {JSON} roomObj - Room Object
 * @param {JSON} user - User Object
 * @returns {void}
 */
function closeChatRoom(roomObj, user) {
  var path = roomObj.path + "/" + roomObj.name + "-" + roomObj.timestamp;
  var payload = {
    body: "left",
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
  remove(ref(database, `/rooms/${path}/users/online/${user.uid}`));
}

/**
 * Adds Chat Room to My Rooms
 * @param {JSON} chatRoomObj - Chat Room Object
 * @param {JSON} user - User Object
 * @returns {void}
 */
function addToMyRooms(chatRoomObj, user) {
  set(
    ref(
      database,
      `/users/${user.uid}/rooms/${chatRoomObj.name}-${chatRoomObj.timestamp}`
    ),
    {
      name: chatRoomObj.name,
      path: chatRoomObj.path,
      timestamp: chatRoomObj.timestamp,
      description: chatRoomObj.description,
      longitude: chatRoomObj.longitude,
      latitude: chatRoomObj.latitude,
    }
  );
  var path =
    chatRoomObj.path + "/" + chatRoomObj.name + "-" + chatRoomObj.timestamp;
  set(ref(database, `/rooms/${path}/users/all/${user.uid}`), user);
}

/**
 * Removes Chat Room from My Rooms
 * @param {JSON} chatRoomObj - Chat Room Object
 * @param {JSON} user - User Object
 * @returns {void}
 */
function removeFromMyRooms(chatRoomObj, user) {
  var path =
    chatRoomObj.path + "/" + chatRoomObj.name + "-" + chatRoomObj.timestamp;
  remove(
    ref(
      database,
      `/users/${user.uid}/rooms/${chatRoomObj.name}-${chatRoomObj.timestamp}`
    )
  );
  remove(ref(database, `/rooms/${path}/users/all/${user.uid}`));
}

/**
 * Header Component
 * @prop {String} mainTab - Main Tab
 * @prop {JSON} chatRoomObj - Chat Room Object
 * @prop {JSON} user - User Object
 */
export function Header({mainTab,chatRoomObj,user,}) {
  
  if (mainTab == "chat") {
    var roomName = chatRoomObj.name + "-" + chatRoomObj.timestamp;
    if (user.rooms != null && roomName in user.rooms) {
      // its in there
      var isMyRoom = true;
    } else {
      // its not in there
      var isMyRoom = false;
    }

  }
  return (
    <div className="flex m-2 rounded-lg h-[63px] bg-white shadow-2xl p-1">
      <div className="flex shrink h-[60px]">
        <Link href="/app">
          <img src="/logos/logo_transparent_inverse.png" className="h-[60px]" />
        </Link>
      </div>
      <div className="grow grid grid-rows-1 grid-flow-col auto-cols-max justify-end gap-2 h-[60px] p-2">
        {mainTab == "chat" && isMyRoom == false && (
          <a
            onClick={() => {
              addToMyRooms(chatRoomObj, user);
              
            }}
            className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-5 flex items-center"
          >
            Add to &quot;My Rooms&quot;
          </a>
        )}
        {mainTab == "chat" && isMyRoom == true && (
          <a
            onClick={() => {
              removeFromMyRooms(chatRoomObj, user);
              
            }}
            className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-5 flex items-center"
          >
            Remove from &quot;My Rooms&quot;
          </a>
        )}
        {mainTab == "chat" && (
          <Link
            onClick={() => {
              closeChatRoom(chatRoomObj, user);
            }}
            href="/app"
            className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-5 flex items-center"
          >
            Close Chat
          </Link>
        )}

        {/* Notifications Panel */}
        <NotificationPanel user={user}/>

        {/*Profile Dropdown */}
        <ProfilePanel user={user}/>
      </div>
    </div>
  );
}

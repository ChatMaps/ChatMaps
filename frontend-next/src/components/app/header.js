// System Imports
import Link from "next/link"

// Firebase Imports
import { database } from "../../../firebase-config";
import { ref, set, remove } from "firebase/database";

// Component Imports
import { NotificationPanel } from "./notifications/notifications";
import { ProfilePanel } from "./profile/ProfilePanel"

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Closes Chat
 * @param {JSON} chatRoomObj - Chat Room Object
 * @param {JSON} user - User Object
 * @returns {void}
 */
function closeChat(chatRoomObj, user) {
  remove(ref(database, `/rooms/${chatRoomObj.path}/${chatRoomObj.name}-${chatRoomObj.timestamp}/users/online/${user.uid}`))
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
export function Header({mainTab,chatRoomObj,user,sidebarControl}) {
  
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
          <img src="/logos/logo_transparent_inverse.png" className="h-[60px] max-xl:hidden" />
          <img src="/logos/icon.png" className="h-[50px] mt-[5px] mb-[5px] xl:hidden" />
        </Link>
      </div>
      <div className="grow grid grid-rows-1 grid-flow-col auto-cols-max justify-end gap-2 h-[60px] p-2">
        {mainTab == "chat" && isMyRoom == false && (
          <a
            onClick={() => {
              addToMyRooms(chatRoomObj, user);
              
            }}
            className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-2 flex items-center"
          >
            <AddIcon/>
          </a>
        )}
        {mainTab == "chat" && isMyRoom == true && (
          <a
            onClick={() => {
              removeFromMyRooms(chatRoomObj, user);
              
            }}
            className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-2 flex items-center"
          >
            <RemoveIcon/>
          </a>
        )}
        {(mainTab == "chat" || mainTab == "dm" ) && (
          <Link
            href="/app"
            className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-2 flex items-center"
            onClick={() => {closeChat(chatRoomObj,user)}}
          >
            <CloseIcon/>
          </Link>
        )}

        {/* Notifications Panel */}
        <NotificationPanel user={user}/>

        {/*Profile Dropdown */}
        <ProfilePanel user={user}/>

        {/* Sidebar Control (for small screens) */}
        <div
            className="md:hidden p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-5 flex items-center"
            onClick={() => {sidebarControl()}}
          >
            <MenuIcon/>
          </div>
      </div>
    </div>
  );
}

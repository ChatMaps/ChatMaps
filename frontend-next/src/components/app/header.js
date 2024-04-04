import { auth, database } from "../../../firebase-config";
import { ref, set, remove } from "firebase/database";
import { signOut } from "firebase/auth";
import { Popover } from "@headlessui/react";
import Link from "next/link"


function logout() {
  signOut(auth);
}

// Closes chat room
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

// Adds room to myRooms
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

// Deletes saved room from myRooms
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

export function Header({
  mainTab,
  chatRoomObj,
  user,
}) {

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

        <Popover className="relative">
          <Popover.Button as="div">
            <div className="mr-5 h-[44px] p-[2px] pr-[15px] cursor-pointer bg-cyan-500 text-white font-bold rounded-full shadow-2xl flex">
              <div className="flex items-center pl-1">{user.firstName}</div>
              <div className="ml-3 rounded-lg">
                <img
                  src={user.pfp}
                  width="40px"
                  className="relative mx-auto rounded-xl overflow-hidden"
                />
              </div>
            </div>
          </Popover.Button>

          <Popover.Panel className="absolute z-10 bg-white mt-[4px] rounded-xl ml-3 shadow-2xl">
            <div className="grid grid-cols-1">
              <Link
                className="rounded-xl p-4 hover:bg-[#C0C0C0]"
                href={"/user/" + user.uid}
              >
                View Profile
              </Link>
              <Link
                className="rounded-xl p-4 hover:bg-[#C0C0C0]"
                onClick={logout}
                href="/"
              >
                Sign Out
              </Link>
            </div>

            <img src="/solutions.jpg" alt="" />
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  );
}

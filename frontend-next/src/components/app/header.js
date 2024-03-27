import { auth, database } from "../../firebase-config";
import { ref, set, remove } from "firebase/database";
import {signOut} from "firebase/auth";
import { Popover } from '@headlessui/react'

  
  function logout() {
    signOut(auth)
  }

  // Closes chat room
  function closeChatRoom(roomObj, setChatRoomObj, setMainTab, user) {
        var path = roomObj.path + "/" + roomObj.name + "-" + roomObj.timestamp;
        var payload = {
          body: "left",
          user: user.username,
          isSystem: true,
          timestamp: new Date().getTime(),
        };
        set(
          ref(
            database,
            `/rooms/${path}/chats/${new Date().getTime()}-${user.username}`
          ),
          payload
        );
        remove(ref(database, `/rooms/${path}/users/online/${user.uid}`));
        setChatRoomObj(null);
        setMainTab("home");
  }

  // Adds room to myRooms
  function addToMyRooms(chatRoomObj, setIsMyRoom, user) {
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
          chatRoomObj.path +
          "/" +
          chatRoomObj.name +
          "-" +
          chatRoomObj.timestamp;
        set(ref(database, `/rooms/${path}/users/all/${user.uid}`), user);
    setIsMyRoom(true);
  }

  // Deletes saved room from myRooms
  function removeFromMyRooms(chatRoomObj, setIsMyRoom, user) {
        var path =
          chatRoomObj.path +
          "/" +
          chatRoomObj.name +
          "-" +
          chatRoomObj.timestamp;
        remove(
          ref(
            database,
            `/users/${user.uid}/rooms/${chatRoomObj.name}-${chatRoomObj.timestamp}`
          )
        );
        remove(ref(database, `/rooms/${path}/users/all/${user.uid}`));
    setIsMyRoom(false);
  }

export function Header({mainTab, isMyRoom, chatRoomObj, setChatRoomObj, setMainTab, setIsMyRoom, user}) {
    return (
        <div className="flex m-2 rounded-lg h-[63px] bg-white shadow-2xl p-1">
          <div className="flex shrink h-[60px]">
            <a href="/app">
              <img
                src="/logos/logo_transparent_inverse.png"
                className="h-[60px]"
              />
            </a>
          </div>
          <div className="grow grid grid-rows-1 grid-flow-col auto-cols-max justify-end gap-2 h-[60px] p-2">
            {mainTab == "chat" && isMyRoom == false && (
              <a
                onClick={() => {
                  addToMyRooms(chatRoomObj, setIsMyRoom, user);
                }}
                className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5 flex items-center"
              >
                Add to &quot;My Rooms&quot;
              </a>
            )}
            {mainTab == "chat" && isMyRoom == true && (
              <a
                onClick={() => {
                  removeFromMyRooms(chatRoomObj, setIsMyRoom, user);
                }}
                className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5 flex items-center"
              >
                Remove from &quot;My Rooms&quot;
              </a>
            )}
            {mainTab == "chat" && (
              <a
                onClick={() => {
                  closeChatRoom(chatRoomObj, setChatRoomObj, setMainTab, user);
                }}
                className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5 flex items-center"
              >
                Close Chat
              </a>
            )}
           
                <Popover className="relative">
                  <Popover.Button as="div">
                    <div className="mr-5 h-[44px] p-[2px] pr-[15px] cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full shadow-2xl flex">
                      <div className="flex items-center pl-1">
                      Nicholas
                      </div>
                      <div className="ml-3 rounded-lg">
                        <img src={user.pfp} width="40px" className="relative mx-auto rounded-xl overflow-hidden"/>
                      </div>
                    </div>
                  </Popover.Button>

                  <Popover.Panel className="absolute z-10 bg-white mt-[4px] rounded-xl ml-3 shadow-2xl">
                    <div className="grid grid-cols-1">
                      <a className="rounded-xl p-4 hover:bg-[#C0C0C0]" href={"/user/"+user.uid}>View Profile</a>
                      <a className="rounded-xl p-4 hover:bg-[#C0C0C0]" onClick={logout} href="/">Sign Out</a>
                    </div>

                    <img src="/solutions.jpg" alt="" />
                  </Popover.Panel>
                </Popover>
          </div>
        </div>
    )
}
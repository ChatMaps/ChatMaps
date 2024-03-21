import { database } from "../../app/api/firebase-config";
import { ref, set, remove } from "firebase/database";
  
  // Closes chat room
  function closeChatRoom(roomObj, setChatRoomObj, setMainTab) {
    fetch("/api/user")
      .then((res) => res.json())
      .then((user) => {
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
      });
  }

  // Adds room to myRooms
  function addToMyRooms(chatRoomObj, setIsMyRoom) {
    fetch("/api/user")
      .then((res) => res.json())
      .then((user) => {
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
      });
    setIsMyRoom(true);
  }

  // Deletes saved room from myRooms
  function removeFromMyRooms(chatRoomObj, setIsMyRoom) {
    fetch("/api/user")
      .then((res) => res.json())
      .then((user) => {
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
      });
    setIsMyRoom(false);
  }

export function Header({mainTab, isMyRoom, chatRoomObj, setChatRoomObj, setMainTab, setIsMyRoom}) {
    return (
        <div className="m-2 rounded-lg h-[63px] bg-white shadow-2xl grid grid-cols-2 p-1">
          <div className="h-[60px]">
            <a href="/">
              <img
                src="logos/logo_transparent_inverse.png"
                className="h-[60px]"
              />
            </a>
          </div>
          <div className="h-[60px] p-4">
            {mainTab == "chat" && isMyRoom == false && (
              <a
                onClick={() => {
                  addToMyRooms(chatRoomObj, setIsMyRoom);
                }}
                className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5"
              >
                Add to &quot;My Rooms&quot;
              </a>
            )}
            {mainTab == "chat" && isMyRoom == true && (
              <a
                onClick={() => {
                  removeFromMyRooms(chatRoomObj, setIsMyRoom);
                }}
                className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5"
              >
                Remove from &quot;My Rooms&quot;
              </a>
            )}
            {mainTab == "chat" && (
              <a
                onClick={() => {
                  closeChatRoom(chatRoomObj, setChatRoomObj, setMainTab);
                }}
                className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5"
              >
                Close Chat
              </a>
            )}
            <a
              href="/api/signout"
              className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full"
            >
              Sign Out
            </a>
          </div>
        </div>
    )
}
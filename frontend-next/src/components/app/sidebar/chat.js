// Component Imports
import { Geo } from "../map/geo";
import { Member } from "../datatypes"

// Sidebar when in a Chatrooms
/**
 * Sidebar while in Chatroom
 * @prop {JSON} chatRoomObj - Chatroom Object
 * @returns {Object} - Sidebar Component
 */
export function Sidebar({chatRoomObj}) {
  // Active users list
  if (
    chatRoomObj.hasOwnProperty("users") &&
    chatRoomObj.users.hasOwnProperty("online")
  ) {
    var activeUsers = [];
    var activeUsersJSON = chatRoomObj.users.online;
    for (var user in activeUsersJSON)
      activeUsers.push(<Member memberObj={activeUsersJSON[user]} key={user}/>);
    var chatroomOnline = activeUsers
  }

  // Users who added to "my rooms"
  if (
    chatRoomObj.hasOwnProperty("users") &&
    chatRoomObj.users.hasOwnProperty("all")
  ) {
    var allUsers = [];
    var allUsersJSON = chatRoomObj.users.all;
    for (var user in allUsersJSON)
      allUsers.push(<Member memberObj={allUsersJSON[user]} key={user}/>);
    var chatroomUsers = allUsers
  }
  return (
    <div className="overflow-hidden h-dvh">
      <div className="m-2 h-[98%] grid grid-cols-1">
        <div className="bg-white rounded-lg m-2 shadow-2xl relative">
          <div className="w-[100%] h-[100%] opacity-50 absolute rounded-lg z-10">
            <Geo
              loc={{
                latitude: parseFloat(chatRoomObj.latitude.toFixed(2)),
                longitude: parseFloat(chatRoomObj.longitude.toFixed(2)),
              }}
              zoom={12}
              moveable={false}
              markers={false}
            />
          </div>
          <div className="z-10 top-0 left-0 w-[100%] h-[100%] absolute text-left pl-3 pt-2">
            <span className="font-bold text-[24px]">{chatRoomObj.name}</span>
            <br />
            {chatRoomObj.description}
          </div>
        </div>
        <div className="bg-white rounded-lg m-2 shadow-2xl">
          <div>Online Members</div>
          {chatroomOnline}
        </div>
        <div className="bg-white rounded-lg m-2 shadow-2xl">
          <div>All Members</div>
          {chatroomUsers}
        </div>
      </div>
    </div>
  );
}

import { Geo } from "../map/geo";

export function Chat_Sidebar({
  chatRoomObj,
  chatroomOnline,
  chatroomUsersLoading,
  chatroomUsers,
  setTab,
}) {
  return (
    <div className="h-dvh">
      <div className="m-2 h-[98%] grid grid-cols-1">
        <div className="bg-white rounded-lg m-2 shadow-2xl relative">
          <div className="w-[100%] h-[100%] opacity-50 absolute rounded-lg z-10">
            <Geo
              loc={{
                latitude: parseFloat(chatRoomObj.latitude.toFixed(2)),
                longitude: parseFloat(chatRoomObj.longitude.toFixed(2)),
              }}
              zoom={12}
              movable={false}
              marker={false}
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
          {!chatroomUsersLoading && chatroomUsers}
        </div>
      </div>
    </div>
  );
}

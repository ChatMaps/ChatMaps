import { Form, useForm } from "react-hook-form";
import { database } from "../../../../firebase-config";
import { ref, set, get } from "firebase/database";
import { useEffect, useState } from "react";

import { ChatRoomSidebar, Marker } from "../datatypes";
// Sidebar on Home Page, with various functionality (create, nearby, my rooms)

// CreateRoom Module for Sidebar Create Tab
function CreateRoom({ loc }) {
  var { register, control, reset, handleSubmit } = useForm();

  function createRoom(data) {
    reset();
    var path =
      String(loc.latitude.toFixed(2)).replace(".", "") +
      "/" +
      String(loc.longitude.toFixed(2)).replace(".", "");
    var timestamp = new Date().getTime();
    var payload = {
      name: data.name,
      description: data.description,
      timestamp: timestamp,
      latitude: loc.latitude,
      longitude: loc.longitude,
      path: path,
    };
    set(ref(database, `/rooms/${path}/${data.name}-${timestamp}`), payload);
  }

  return (
    <div className="overflow-y-auto h-[90%]">
      <Form control={control} onSubmit={handleSubmit(createRoom)}>
        <input {...register("name")} placeholder="Room Name" className="mt-2" />
        <input
          {...register("description")}
          placeholder="Room Description"
          className="mt-2"
        />
        <br />
        <div className="mt-3 mb-2">
          Creating room near ({loc.latitude.toFixed(2)},{" "}
          {loc.longitude.toFixed(2)})
        </div>
        <button className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-5">
          Create
        </button>
      </Form>
    </div>
  );
}

export function Home_Sidebar({
  user,
  location,
  loadingLoc
}) {
  const [tab, setTab] = useState("rooms");
  const [nearbyArr, setNearbyArr] = useState([])
  const [nearbyArrReady, setNearbyArrReady] = useState(false)

  // Add myRooms to Sidebar
  var myRoomArr = [];
  for (var room in user.rooms) {
    var newRoom = (
      <ChatRoomSidebar
        roomObj={user.rooms[room]}
        key={user.rooms[room].timestamp}
      />
    );
    myRoomArr.push(newRoom);
  }

  useEffect(() => {
    var nearbyArr = []
    if (location) {
      var path = String(location.latitude.toFixed(2)).replace(".", "") + "/" + String(location.longitude.toFixed(2)).replace(".", "");
      get(ref(database, `/rooms/${path}`)).then((snapshot) => {
        // Add nearby to Sidebar
        if (snapshot.exists()) {
          var rooms = snapshot.val()
          for (var room in rooms) {
            console.log(rooms[room])
            var newRoom = (
              <ChatRoomSidebar
                roomObj={rooms[room]}
                key={rooms[room].timestamp}
              />
            );
            nearbyArr.push(newRoom);
          }
          }
          setNearbyArr(nearbyArr)
          setNearbyArrReady(true)
      })
    }
  }, [location])

  return (
    <div className="h-dvh">
      <div className="bg-white shadow-2xl rounded-lg m-2 h-[98%]">
        <div className="p-2">
          <div className="p-1 rounded-lg grid grid-cols-3 bg-white">
            <div
              className={
                tab == "nearby"
                  ? "select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]"
                  : "select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]"
              }
              onClick={() => {
                setTab("nearby");
              }}
            >
              Nearby
            </div>
            <div
              className={
                tab == "rooms"
                  ? "select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]"
                  : "select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]"
              }
              onClick={() => {
                setTab("rooms");
              }}
            >
              My Rooms
            </div>
            <div
              className={
                tab == "create"
                  ? "select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]"
                  : "select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]"
              }
              onClick={() => {
                setTab("create");
              }}
            >
              Create
            </div>
          </div>
        </div>
        {tab == "nearby" && (
          <div className="overflow-y-auto h-[90%]">
            <div>
              {!nearbyArr && !loadingLoc && (
                <div>
                  No Nearby Rooms
                  <br />
                  Create One?
                </div>
              )}
              {loadingLoc && <div>Loading...</div>}
              {nearbyArrReady && nearbyArr}
            </div>
          </div>
        )}
        {tab == "rooms" && (
          <div className="overflow-y-auto h-[90%]">
            <div>
              {!myRoomArr && <div>No User Saved Rooms</div>}
              {myRoomArr}
            </div>
          </div>
        )}
        {tab == "create" && !loadingLoc && <CreateRoom loc={location} />}
        {tab == "create" && loadingLoc && <div>Loading...</div>}
      </div>
    </div>
  );
}

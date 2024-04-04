// System Imports
import { Form, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

// Dependency Imports
import { Tab } from '@headlessui/react'

// Firebase Imports
import { database } from "../../../../firebase-config";
import { ref, set, get } from "firebase/database";

// Component Imports
import { ChatRoomSidebar } from "../datatypes";


/**
 * Create Room Component for /app Sidebar
 * @prop {JSON} loc - Location Object (latitude, longitude)
 * @returns {Object} - Create Room Component
 */
function CreateRoom({ loc }) {
  var { register, control, reset, handleSubmit } = useForm();

  /**
   * Creates Room in Firebase DB
   * @prop {JSON} data - Room Data
   * @returns {void}
   */
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

/**
 * Joins class names together for Tailwind CSS
 * @param  {...String} classes - Class names
 * @returns {String} - Class names (joined)
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * App Page Sidebar Component
 * @prop {JSON} user - User Object
 * @prop {JSON} location - Location Object (latitude, longitude)
 * @prop {Boolean} loadingLoc - Loading Location State
 * @returns {Object} - App Page Sidebar Component
 */
export function Sidebar({user,location,loadingLoc}) {
  const [tab, setTab] = useState("nearby");
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
        <Tab.Group>
          <Tab.List className="bg-[#D3D3D3] rounded-lg mt-5">
            <Tab className={({ selected }) =>
                classNames(
                  'w-[31%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )} defaultIndex={1}>Nearby</Tab>
            <Tab className={({ selected }) =>
                classNames(
                  'w-[31%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )}>My Rooms</Tab>
            <Tab className={({ selected }) =>
                classNames(
                  'w-[31%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )}>Create</Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
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
            </Tab.Panel>
            <Tab.Panel>
            <div className="overflow-y-auto h-[90%]">
              <div>
                  {!myRoomArr && <div>No User Saved Rooms</div>}
                  {myRoomArr}
              </div>
            </div>
            </Tab.Panel>
            <Tab.Panel>
              {!loadingLoc && <CreateRoom loc={location} />}
              {loadingLoc && <div>Loading...</div>}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

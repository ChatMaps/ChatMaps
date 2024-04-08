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

// Friend Imports (TEMP)
import { Friend, FriendRequest } from "../friends/friends";

// DM Imports
import { DM } from "../friends/dm";

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
  const [nearbyArr, setNearbyArr] = useState([])
  const [nearbyArrReady, setNearbyArrReady] = useState(false)
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState(null)
  const [dms, setDMs] = useState((<div>No DMs</div>))
  // Add myRooms to Sidebar
  var myRoomArr = [];
  for (var room in user.rooms) {
    get(ref(database, `/rooms/${user.rooms[room].path}/${user.rooms[room].name}-${user.rooms[room].timestamp}`)).then((snapshot) => {
      var newRoom = (
        <ChatRoomSidebar
          roomObj={snapshot.val()}
          key={snapshot.val().timestamp}
        />
      );
      myRoomArr.push(newRoom);
    })
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
          } else {
            nearbyArr.push(<div className="pt-5">No Nearby Rooms<br />Create One?</div>)
          }
          setNearbyArr(nearbyArr)
          setNearbyArrReady(true)
      })
    }
  }, [location])

  useEffect(() => {
    if (user && user.friends) {
      get(ref(database, "/users/")).then((snapshot) => {
        var users = snapshot.val();
        var friends = [];
        for (var friend in user.friends.friends) {
          friends.push(<Friend user={user} friendObj={users[friend]} key={friend} />);
        }
        setFriends(friends);
    });

    var requestArr = [];
    for (var request in user.friends.requests) {
      get(ref(database, `/users/${request}`)).then((snapshot) => {
        requestArr.push(<FriendRequest requestingUser={snapshot.val()} user={user} key={request} />);
      });
    }
    setFriendRequests(requestArr);
    } else {
      setFriends(<div>No Friends</div>);
      setFriendRequests(<div>No Friend Requests</div>);
    }

    get(ref(database, `/dms`)).then((snapshot) => {
      var dmsList = snapshot.val();
      var dmArr = [];
      for(var dmRoom in dmsList) {
        if (user.uid == dmsList[dmRoom].UIDs[0]) {
          get(ref(database, `/users/${dmsList[dmRoom].UIDs[1]}`)).then((snapshot) => {
            var friendObj = snapshot.val()
            dmArr.push(<DM user={user} friendObj={friendObj} key={dmRoom}/>);
            setDMs(dmArr);
          })
        } else if (user.uid == dmsList[dmRoom].UIDs[1]) {
          get(ref(database, `/users/${dmsList[dmRoom].UIDs[0]}`)).then((snapshot) => {
            var friendObj = snapshot.val()
            dmArr.push(<DM user={user} friendObj={friendObj} key={dmRoom}/>);
            setDMs(dmArr);
          })
        }  
      }
       
    })
  }, [user])

  return (
    <div className="h-dvh bg-[aliceblue] pt-2 pb-2 pl-2 pr-1">
      <div className="bg-white rounded-lg h-[98%] mb-[10px] mt-[-18px] mr-2">
        <Tab.Group>
          <Tab.List className="bg-[#D3D3D3] rounded-lg mt-5">
            <Tab className={({ selected }) =>
                classNames(
                  'w-[30%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )} defaultIndex={1}>Nearby</Tab>
            <Tab className={({ selected }) =>
                classNames(
                  'w-[30%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )}>My Rooms</Tab>
            <Tab className={({ selected }) =>
                classNames(
                  'w-[30%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )}>Create</Tab>
                <Tab className={({ selected }) =>
                classNames(
                  'w-[30%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )} defaultIndex={1}>DMs</Tab>
                <Tab className={({ selected }) =>
                classNames(
                  'w-[30%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )} defaultIndex={1}>Friends</Tab>
                <Tab className={({ selected }) =>
                classNames(
                  'w-[30%]',
                  selected
                    ? 'bg-cyan-500 text-white font-bold shadow hover:bg-white/[0.6] hover:text-black'
                    : 'hover:bg-cyan-500/[0.6] hover:text-white hover:font-bold'
                )} defaultIndex={1}>Requests</Tab>
                
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="overflow-y-auto h-[90%]">
                <div>
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
            <Tab.Panel>
              {dms}
            </Tab.Panel>
            <Tab.Panel>
              {friends}
            </Tab.Panel>
            <Tab.Panel>
              {friendRequests}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

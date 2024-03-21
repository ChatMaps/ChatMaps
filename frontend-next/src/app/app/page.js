"use client";
// System Imports
import { useState, useEffect } from "react";
import { database } from "../api/firebase-config";
import { ref, onValue, get, set, remove } from "firebase/database";
import { useBeforeunload } from "react-beforeunload";
import {Marker} from "pigeon-maps";

// Refactored Component Imports
// Data Structure Imports
import { ChatRoomSidebar, Member } from "../../../components/app/datatypes";

// Header import
import { Header } from "../../../components/app/header";

// Main Tab Imports
import { MainTabChatRoom } from "../../../components/app/main_tab/chat";
import { MainTabHome } from "../../../components/app/main_tab/home";

// Sidebar Imports
import {Home_Sidebar} from "../../../components/app/sidebar/home";
import { Chat_Sidebar } from "../../../components/app/sidebar/chat";
import { Profile_Sidebar } from "../../../components/app/sidebar/profile";

// Contains most everything for the app homepage
function Home() {
  // It's time to document and change these awful variable names
  // State variables for app page
  const [mainTab, setMainTab] = useState("home"); // Primary tab
  const [tab, setTab] = useState("nearby"); // Sidebar Tab
  const [chatRoomObj, setChatRoomObj] = useState(null); // Current chatroom object
  const [myRoomsObj, setMyRoomsObj] = useState(null); // My Rooms Object
  const [myRooms, setRoomData] = useState(null); // Current user saved rooms list
  const [isRoomLoading, setRoomLoading] = useState(true); // myRooms loading variable, true = myRooms loading, false = finished loading
  const [isMyRoom, setIsMyRoom] = useState(false); // Is current room in myRooms? true, false
  const [location, setLocation] = useState(null); // location variable [lat,long]
  const [loadingLoc, setLoadingLoc] = useState(true); // location variable loading, true = loading, false = finished loading
  const [nearby, setNearby] = useState(null); // nearby rooms array
  const [loadingNearby, setLoadingNearby] = useState(true); // loading nearby rooms array, true = loading, false = finished loading
  const [chatroomOnline, setChatRoomOnline] = useState(null); // holds online users
  const [chatroomUsers, setChatroomUsers] = useState(null); // holds all chatroom users
  const [chatroomUsersLoading, setChatroomUsersLoading] = useState(true);
  const [users, setUsers] = useState(null); // all users from firebase
  const [markers, setMarkers] = useState([]);

  // Grabs user data, saves to user, then lists the users saved rooms
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((user) => {
        onValue(ref(database, "/users/" + user.uid + "/rooms"), (snapshot) => {
          setRoomLoading(true);
          var rooms = snapshot.val();
          setMyRoomsObj(rooms);
          var roomArr = [];
          var markerArr = markers;
          for (var room in rooms) {
            var newRoom = (
              <ChatRoomSidebar
                roomObj={rooms[room]}
                key={rooms[room].timestamp}
                click={selectChatRoom}
              />
            );
            markerArr.push(
              <Marker
                width={30}
                anchor={[rooms[room].latitude, rooms[room].longitude]}
                color="blue"
              />
            );
            roomArr.push(newRoom);
          }
          setMarkers(markerArr);
          setRoomData(roomArr);
          setRoomLoading(false);
        });
      });
  }, []);

  // Grabs the user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {

        setLocation(coords)
        setLoadingLoc(false)
        var path = String(coords.latitude.toFixed(2)).replace(".","")+"/"+String(coords.longitude.toFixed(2)).replace(".","")
        var markersArr = markers
        onValue(ref(database, `/rooms/${path}`), (snapshot) => {
          var nearbyArr = []
          if (snapshot.exists()) {
            var data = snapshot.val();
            for (var room in data) {
              nearbyArr.push(
                <ChatRoomSidebar roomObj={data[room]} click={selectChatRoom} />
              );
              // TODO: RANDOM LAST DIGIT TO MOVE AROUND THE MAP
              markersArr.push(
                <Marker
                  width={30}
                  anchor={[data[room].latitude, data[room].longitude]}
                  color="blue"
                />
              );
            }
            setMarkers(markersArr);
            setLoadingNearby(false);
            setNearby(nearbyArr);
          } else {
            setLoadingNearby(false);
          }
        });
      });
    }
  }, []);

  // Grab list of all users
  useEffect(() => {
    get(ref(database, `/users`)).then((snapshot) => {
      setUsers(snapshot.val());
    });
  }, []);

  // Dont Double Send Leaving Message
  useEffect(() => {
    if (myRoomsObj && chatRoomObj) {
      var roomName = chatRoomObj.name + "-" + chatRoomObj.timestamp;
      if (myRooms != null && roomName in myRoomsObj) {
        // its in there
        setIsMyRoom(true);
      } else {
        // its not in there
        setIsMyRoom(false);
      }
    }
  }, [chatRoomObj]);

  // Selects chat room
  function selectChatRoom(roomObj) {
    fetch("/api/user")
      .then((res) => res.json())
      .then((user) => {
        // Path of chatroom
        var path = roomObj.path + "/" + roomObj.name + "-" + roomObj.timestamp;

        setChatRoomObj(roomObj);

        // Send entered message
        var payload = {
          body: "entered",
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

        // Code for Room Data
        set(ref(database, `/rooms/${path}/users/online/${user.uid}`), user);
        onValue(ref(database, `/rooms/${path}`), (snapshot) => {
          setChatRoomOnline(null);
          setChatroomUsers(null);

          // Active users list
          if (
            snapshot.val().hasOwnProperty("users") &&
            snapshot.val().users.hasOwnProperty("online")
          ) {
            var activeUsers = [];
            var activeUsersJSON = snapshot.val().users.online;
            for (var user in activeUsersJSON)
              activeUsers.push(<Member memberObj={activeUsersJSON[user]} />);
            setChatRoomOnline(activeUsers);
          }

          // Users who added to "my rooms"
          console.log(
            snapshot.val().hasOwnProperty("users") &&
              snapshot.val().users.hasOwnProperty("all")
          );
          if (
            snapshot.val().hasOwnProperty("users") &&
            snapshot.val().users.hasOwnProperty("all")
          ) {
            setChatroomUsersLoading(true);
            var allUsers = [];
            var allUsersJSON = snapshot.val().users.all;
            for (var user in allUsersJSON)
              allUsers.push(<Member memberObj={allUsersJSON[user]} />);
            setChatroomUsers(allUsers);
            setChatroomUsersLoading(false);
          }
        });
        setMainTab("chat");
      });
  }

  // Fires to tell other uses that you are leaving the room
  useBeforeunload(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((user) => {
        if (chatRoomObj && mainTab == "chat") {
          var payload = {
            body: "left",
            user: user.username,
            isSystem: true,
            timestamp: new Date().getTime(),
          };
          set(
            ref(
              database,
              `/rooms/${
                chatRoomObj.path +
                "/" +
                chatRoomObj.name +
                "-" +
                chatRoomObj.timestamp
              }/chats/${new Date().getTime()}-${user.username}`
            ),
            payload
          );
          remove(
            ref(
              database,
              `/rooms/${
                chatRoomObj.path +
                "/" +
                chatRoomObj.name +
                "-" +
                chatRoomObj.timestamp
              }/users/online/${user.uid}`
            )
          );
        }
      });
  });

  return (
    <div className="grid grid-cols-4 auto-cols-max overflow-hidden">
      {/* Left Side of Page */}
      <div className="col-span-3 h-dvh">
        {/* Header */}
        <Header mainTab={mainTab} isMyRoom={isMyRoom} chatRoomObj={chatRoomObj} setChatRoomObj={setChatRoomObj} setMainTab={setMainTab} setIsMyRoom={setIsMyRoom}/>
        {/* Main Page Section */}
        <div className="mr-2 h-[calc(100%-110px)]">
          {mainTab == "home" && !loadingLoc && (
            <MainTabHome loc={location} markers={markers} />
          )}
          {mainTab == "home" && loadingLoc && (
            <MainTabHome loc={null} markers={markers} />
          )}
          {mainTab == "chat" && <MainTabChatRoom roomObj={chatRoomObj}/>}
        </div>
      </div>
      {/* Sidebar (Right Side of Page) */}
      {mainTab == "home" && (
        <Home_Sidebar tab={tab} nearby={nearby} loadingNearby={loadingNearby} setTab={setTab} isRoomLoading={isRoomLoading} myRooms={myRooms} loadingLoc={loadingLoc} location={location}/>
      )}
      {mainTab == "chat" && (
        <Chat_Sidebar chatRoomObj={chatRoomObj} chatroomOnline={chatroomOnline} chatroomUsersLoading={chatroomUsersLoading} chatroomUsers={chatroomUsers}/>
      )}
      {mainTab == "profile" && (
        <Profile_Sidebar/>
      )}
    </div>
  );
}

export default Home;
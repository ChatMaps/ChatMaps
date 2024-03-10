"use client"
import { useState, useEffect } from 'react'
import {Map, Marker, ZoomControl} from "pigeon-maps"
import { Form, useForm } from "react-hook-form";
import { app } from "../api/firebase-config";
import { getDatabase, ref, onValue, get, set, remove} from "firebase/database";
import { useBeforeunload } from 'react-beforeunload';
var database = getDatabase(app)


// Data Types

// Chat Message
function Chat({chatObj}) {
  let dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return (
    <div className='width-[100%] bg-white rounded-lg mt-1 text-left p-1 grid grid-cols-2 mr-2'>
      <div>
        {chatObj.user}: {chatObj.body}
      </div>
      <div className='text-right text-[#d1d1d1]'>
        {new Date(chatObj.timestamp).toLocaleString(dateOptions)}
      </div>
    </div>
  )
}

// System Chat Message
function SystemMessage({chatObj}) {
  let dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return (
    <div className='width-[100%] bg-white rounded-lg mt-1 text-left p-1 grid grid-cols-2 mr-2'>
      <div className='text-[#d1d1d1]'>
        {chatObj.user} has {chatObj.body} the room.
      </div>
      <div className='text-right text-[#d1d1d1]'>
        {new Date(chatObj.timestamp).toLocaleString(dateOptions)}
      </div>
    </div>
  )
}

// Member for Active/Room members in sidebar
function Member({memberObj}) {
  return (
    <div className='cursor-pointer g-[aliceblue] rounded-lg m-3 shadow-xl p-2'>
      {memberObj.username}
    </div>
  )
}

// Chat Room for myRooms and Nearby in sidebar
function ChatRoomSidebar({roomObj, click}) {
  // TODO: Gross fix but it works
function clicker() {
  click(roomObj.name+"-"+roomObj.timestamp, roomObj)
}
return (
  <div onClick={clicker} className='border-[black] border-1 shadow-lg p-2 m-2 rounded-lg cursor-pointer'>
    <div className='col-span-2'>
      <div className='font-bold'>{roomObj.name}</div>
      <div className='italic'>{roomObj.description}</div>
    </div>
  </div>
)
}

// Map module for main page and chat room sidebar
// TODO: MAKE NOT MOVABLE
function Geo({loc, zoom, movable, marker}) {
  if (loc) {
    return (
      <Map center={[loc.latitude, loc.longitude]} defaultZoom={zoom}>
        {marker && <Marker width={50} anchor={[loc.latitude, loc.longitude]} color="red"/>}
        {zoom && <ZoomControl />}
      </Map>
    )
  } else {
    return (
      <Map className="rounded-lg" defaultCenter={[0, 0]} defaultZoom={zoom}/>
    )
  }
  
}

// Module for Welcome Message on main tab landing page
function WelcomeMessage() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
  if (isLoading) return <div></div>
  if (!data) return <div></div>

  return (
    <div className="bg-white rounded-lg m-2 mt-4 text-left p-2 pl-5">
      <div>
        Welcome, {data.firstName} {data.lastName} ({data.username})
      </div>
      <div>
        Lets see what&apos;s happening in your area.
      </div>
    </div>
  )

}

// Main Tabs
// Primary App Landing Page
function MainTabHome({loc}) {
  return (
    <>
    <WelcomeMessage />
    <div className='h-[calc(100%-110px)] m-5 rounded-lg'>
      <Geo loc={loc} zoom={14} movable={true} marker={true}/>
    </div>
    </>
  )
}

// Chatroom Module for Primary Tab
function MainTabChatRoom({roomObj}) {
  var { register, control, reset, handleSubmit} = useForm()
  const [chats, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  // Message updater
  useEffect(() => {
    onValue(ref(database, `/rooms/${roomObj.path+"/"+roomObj.name+"-"+roomObj.timestamp}/chats`), (snapshot) => {
        var chatsArr = []
        var messages = snapshot.val()
        for (var message in messages) {
          if (messages[message].isSystem) {
            chatsArr.push(<SystemMessage chatObj={messages[message]} key={messages[message].timestamp}/>)
          } else {
            chatsArr.push(<Chat chatObj={messages[message]} key={messages[message].timestamp}/>)
          }
        }
        setData(chatsArr.reverse())
        setLoading(false)
    })
  }, [])

  function sendMessage(data) {
    reset()
    fetch('/api/user').then((res) => res.json())
    .then((user) => {
      var payload = {
        body: data.message,
        user: user.username,
        isSystem: false,
        timestamp: new Date().getTime()
      }
      set(ref(database,`/rooms/${roomObj.path+"/"+roomObj.name+"-"+roomObj.timestamp}/chats/${new Date().getTime()}-${user.username}`), payload)
    })
  }

  if (isLoading) return <div>Loading</div>
  if (!chats) return <div>No Chats</div>
  return (
    <div className='m-1 h-[100%] rounded-lg'>
      <div className='h-[90%] m-4 overflow-y-auto flex flex-col-reverse'>
        {chats}
      </div>
      <div className='m-2 h-[10%] w-[100%] bg-white rounded-lg'>
        <Form onSubmit={handleSubmit(sendMessage)} control={control} className='w-[100%] p-[0px]'>
          <input type="text" {...register("message")} placeholder="Enter message" className='w-[83%] border-[0px] mt-[8px] mb-[8px]'/>
          <button className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5 w-[8%]">Send</button>
        </Form>
      </div>
    </div>
  )
}

// Contains most everything for the app homepage
// 
function Home() {
  // It's time to document and change these awful variable names
  // State variables for app page
  const [mainTab, setMainTab] = useState("home") // Primary tab
  const [tab, setTab] = useState("nearby") // Sidebar Tab
  const [chatRoomObj, setChatRoomObj] = useState(null) // Current chatroom object
  const [myRoomsObj, setMyRoomsObj] = useState(null) // My Rooms Object
  const [myRooms, setRoomData] = useState(null) // Current user saved rooms list
  const [isRoomLoading, setRoomLoading] = useState(true) // myRooms loading variable, true = myRooms loading, false = finished loading
  const [isMyRoom, setIsMyRoom] = useState(false) // Is current room in myRooms? true, false
  const [location, setLocation] = useState(null) // location variable [lat,long]
  const [loadingLoc, setLoadingLoc] = useState(true) // location variable loading, true = loading, false = finished loading
  const [nearby, setNearby] = useState(null); // nearby rooms array
  const [loadingNearby, setLoadingNearby] = useState(true); // loading nearby rooms array, true = loading, false = finished loading
  const [chatroomOnline, setChatRoomOnline] = useState(null) // holds online users
  const [chatroomUsers, setChatroomUsers] = useState(null) // holds all chatroom users
  const [users, setUsers] = useState(null) // all users from firebase
  const [alreadyLeft, setAlreadyLeft] = useState(false) // if already left from room

  // Grabs user data, saves to user, then lists the users saved rooms
  useEffect(() => {
    fetch('/api/user').then((res) => res.json())
    .then((user) => {
      get(ref(database, '/users/'+user.uid+'/rooms')).then((snapshot) => {
        var rooms = snapshot.val()
        setMyRoomsObj(rooms)
        var roomArr = []
        for (var room in rooms) {
          var newRoom = <ChatRoomSidebar roomObj={rooms[room]} key={rooms[room].timestamp} click={selectChatRoom}/>
          roomArr.push(newRoom)
        }
        setRoomData(roomArr)
        setRoomLoading(false)
      })
    })
}, [])

  // Grabs the user location
  useEffect(() => {
    if('geolocation' in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setLocation(coords)
        setLoadingLoc(false)
        var nearbyArr = []
        var path = String(coords.latitude.toFixed(2)).replace(".","")+"/"+String(coords.longitude.toFixed(2)).replace(".","")
        get(ref(database, `/rooms/${path}`)).then((snapshot) => {
          if (snapshot.exists()) {
            var data = snapshot.val()
            for (var room in data) {
              nearbyArr.push(<ChatRoomSidebar roomObj={data[room]} click={selectChatRoom}/>)
            }
            setLoadingNearby(false)
            setNearby(nearbyArr)
          } else {
            setLoadingNearby(false)
          }
        })
      })
    }
  }, []);

  // Grab list of all users
  useEffect(() => {
    get(ref(database, `/users`)).then((snapshot) => {
      setUsers(snapshot.val())
    })
    
  }, []);

  useEffect(() => {
   if (myRoomsObj && chatRoomObj) {
    var roomName = chatRoomObj.name+"-"+chatRoomObj.timestamp
    if (myRooms != null && roomName in myRoomsObj) {
      // its in there
      setIsMyRoom(true)
    } else {
      // its not in there
      setIsMyRoom(false)
    }
   }
  }, [chatRoomObj])

  // CreateRoom Module for Sidebar Create Tab
  function CreateRoom({loc}) {
    var { register, control, reset, handleSubmit} = useForm()
  
    function createRoom(data) {
      reset()
      var path = String(loc.latitude.toFixed(2)).replace(".","")+"/"+String(loc.longitude.toFixed(2)).replace(".","")
      var timestamp = new Date().getTime()
      var payload = {
        name: data.name,
        description: data.description,
        timestamp: timestamp,
        latitude: loc.latitude,
        longitude: loc.longitude,
        path: path
      }
      set(ref(database,`/rooms/${path}/${data.name}-${timestamp}`), payload)
    }
  
    return (
      <div className='overflow-y-auto h-[90%]'>
        <Form control={control} onSubmit={handleSubmit(createRoom)}>
          <input {...register("name")} placeholder='Room Name' className='mt-2'/>
          <input {...register("description")} placeholder='Room Description' className='mt-2'/><br/>
          <div className='mt-3 mb-2'>
            Creating room near ({loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)})
          </div>
          <button className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5">Create</button>
        </Form>
      </div>
    )
  }

  // Selects chat room
  function selectChatRoom(roomName, roomObj) {
    fetch('/api/user').then((res) => res.json())
    .then((user) => {
      // Path of chatroom
      var path = roomObj.path+"/"+roomObj.name+"-"+roomObj.timestamp

      setChatRoomObj(roomObj)

      // Send entered message
      var payload = {
        body: "entered",
        user: user.username,
        isSystem: true,
        timestamp: new Date().getTime()
      }
      set(ref(database,`/rooms/${path}/chats/${new Date().getTime()}-${user.username}`), payload)
      
      // Code for Room Data
      set(ref(database, `/rooms/${path}/users/online/${user.uid}`), user)
      onValue(ref(database, `/rooms/${path}`), (snapshot) => {

        // Active users list
        if (snapshot.val().hasOwnProperty("users") && snapshot.val().users.hasOwnProperty("online")) {
          var activeUsers = []
          var activeUsersJSON = snapshot.val().users.online
          for (var user in activeUsersJSON)
            activeUsers.push(<Member memberObj={activeUsersJSON[user]}/>)
          setChatRoomOnline(activeUsers)
        }

        // Users who added to "my rooms"
        if (snapshot.val().hasOwnProperty("users") && snapshot.val().users.hasOwnProperty("all")) {
          var allUsers = []
          var allUsersJSON = snapshot.val().users.all
          for (var user in allUsersJSON)
            allUsers.push(<Member memberObj={allUsersJSON[user]}/>)
          setChatroomUsers(allUsers)
        }

      })
      setMainTab("chat")
      setAlreadyLeft(false)
    })
  }

  // Closes chat room
  function closeChatRoom(roomObj) {
    fetch('/api/user').then((res) => res.json())
    .then((user) => {
      var path = roomObj.path+"/"+roomObj.name+"-"+roomObj.timestamp
      var payload = {
        body: "left",
        user: user.username,
        isSystem: true,
        timestamp: new Date().getTime()
      }
      set(ref(database,`/rooms/${path}/chats/${new Date().getTime()}-${user.username}`), payload)
      remove(ref(database, `/rooms/${path}/users/online/${user.uid}`))
      setChatRoomObj(null)
      setAlreadyLeft(true)
      setMainTab("home")
    })
  }

  // Adds room to myRooms
  function addToMyRooms() {
    fetch('/api/user').then((res) => res.json())
    .then((user) => {
      set(ref(database,`/users/${user.uid}/rooms/${chatRoomObj.name}-${chatRoomObj.timestamp}`), {
        name: chatRoomObj.name,
        path: chatRoomObj.path,
        timestamp: chatRoomObj.timestamp,
        description: chatRoomObj.description,
        longitude: chatRoomObj.longitude,
        latitude: chatRoomObj.latitude,
      })
    })
    setIsMyRoom(true)
  }

  // Deletes saved room from myRooms
  function removeFromMyRooms() {
    fetch('/api/user').then((res) => res.json())
    .then((user) => {
      remove(ref(database,`/users/${user.uid}/rooms/${chatRoomObj.name}-${chatRoomObj.timestamp}`))
    })
    setIsMyRoom(false)
  }

  // Fires to tell other uses that you are leaving the room
  useBeforeunload(() => {
    fetch('/api/user').then((res) => res.json())
      .then((user) => {
        if (chatRoomObj && mainTab == "chat") {
          var payload = {
            body: "left",
            user: user.username,
            isSystem: true,
            timestamp: new Date().getTime()
          }
          set(ref(database,`/rooms/${chatRoomObj.path+"/"+chatRoomObj.name+"-"+chatRoomObj.timestamp}/chats/${new Date().getTime()}-${user.username}`), payload)
          remove(ref(database, `/rooms/${chatRoomObj.path+"/"+chatRoomObj.name+"-"+chatRoomObj.timestamp}/users/online/${user.uid}`))
        }
      })
  });

  return (
    <div className="grid grid-cols-4 auto-cols-max overflow-hidden">
      {/* Left Side of Page */}
      <div className="col-span-3 h-dvh">
        {/* Header */}
        <div className="m-2 rounded-lg h-[63px] bg-white shadow-2xl grid grid-cols-2 p-1">
          <div className='h-[60px]'>
            <a href="/"><img src="logos/logo_transparent_inverse.png" className='h-[60px]'/></a>
          </div>
          <div className='h-[60px] p-4'>
            {(mainTab == "chat" && isMyRoom == false) && <a onClick={() => {addToMyRooms()}} className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5">Add to &quot;My Rooms&quot;</a>}
            {(mainTab == "chat" && isMyRoom == true) && <a onClick={() => {removeFromMyRooms()}} className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5">Remove from &quot;My Rooms&quot;</a>}
            {mainTab == "chat" && <a onClick={() => {closeChatRoom(chatRoomObj)}} className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5">Close Chat</a>}
            <a href="/api/signout" className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full">Sign Out</a>
          </div>
        </div>
        {/* Main Page Section */}
        <div className="mr-2 h-[calc(100%-110px)]">
          {(mainTab == "home" && !loadingLoc) && <MainTabHome loc={location}/>}
          {(mainTab == "home" && loadingLoc) && <MainTabHome loc={null}/>}
          {mainTab == "chat" && <MainTabChatRoom roomObj={chatRoomObj}/>}
        </div>
      </div>
      {/* Sidebar (Right Side of Page) */}
      {mainTab == "home" &&
      <div className="h-dvh">
          <div className="bg-white shadow-2xl rounded-lg m-2 h-[98%]">
              <div className='p-2'>
                <div className='p-1 rounded-lg grid grid-cols-3 bg-white'>
                  <div className={tab == "nearby"? 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]': 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]'} onClick={() => {setTab("nearby")}}>Nearby</div>
                  <div className={tab == "rooms"? 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]': 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]'} onClick={() => {setTab("rooms")}}>My Rooms</div>
                  <div className={tab == "create"? 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]': 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]'} onClick={() => {setTab("create")}}>Create</div>
                </div>
              </div>
              {(tab == "nearby") && <div className='overflow-y-auto h-[90%]'>
                <div>
                  {(!nearby && !loadingNearby) && <div>No Nearby Rooms<br/>Create One?</div>}
                  {loadingNearby && <div>Loading...</div>}
                  {nearby}
                </div>
              </div>}
              {tab == "rooms" && <div className='overflow-y-auto h-[90%]'>
                <div>
                  {isRoomLoading && <div>Loading</div>}
                  {(!myRooms && !isRoomLoading) && <div>No User Saved Rooms</div>}
                  {myRooms}
                </div>
              </div>}
              {(tab == "create" && !loadingLoc) && <CreateRoom loc={location}/>}
              {(tab == "create" && loadingLoc) && <div>Loading...</div>}
          </div>
      </div> }
      {(mainTab == "chat") && 
      <div className="h-dvh">
        <div className="m-2 h-[98%] grid grid-cols-1">
          <div className='bg-white rounded-lg m-2 shadow-2xl relative'>
              <div className='w-[100%] h-[100%] opacity-50 absolute rounded-lg z-10'>
                <Geo loc={{latitude: parseFloat(chatRoomObj.latitude.toFixed(2)), longitude: parseFloat(chatRoomObj.longitude.toFixed(2))}} zoom={12} movable={false} marker={false}/>
              </div>
              <div className='z-10 top-0 left-0 w-[100%] h-[100%] absolute text-left pl-3 pt-2'>
                <span className='font-bold text-[24px]'>{chatRoomObj.name}</span><br/>
                {chatRoomObj.description}
              </div>
          </div>
          <div className='bg-white rounded-lg m-2 shadow-2xl'>
            <div>
              Online Members
            </div>
            {chatroomOnline}
          </div>
          <div className='bg-white rounded-lg m-2 shadow-2xl'>
            <div>
              All Members
            </div>
            {chatroomUsers}
          </div>
        </div>
      </div>
      }
      {(mainTab == "profile") && 
      <div className="h-dvh">
        <div className=" bg-white m-2 h-[98%]">
          Profile
        </div>
      </div>
      }
    </div>
  )
}

export default Home;
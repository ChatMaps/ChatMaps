"use client"
import { useState, useEffect, createContext, useContext } from 'react'
import {Map, Marker, ZoomControl} from "pigeon-maps"
import { Form, useForm } from "react-hook-form";
import { app } from "../api/firebase-config";
import { getDatabase, ref, onValue, get, set} from "firebase/database";
var database = getDatabase(app)

// Data types
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

function ChatRoomSidebar({roomObj, click}) {
return (
  <div onClick={click} className='border-[black] border-1 shadow-lg p-2 m-2 rounded-lg cursor-pointer'>
    <div className='col-span-2'>
      <div className='font-bold'>{roomObj.name}</div>
      <div className='italic'>{roomObj.description}</div>
    </div>
  </div>
)
}


function WelcomeMessage() {
  //TODO: REALLY GROSS WAY TO GET COOKIES, NEED NEW WAY TO STORE USER DATA WITHOUT API CALLS. THIS PAGE HAS TO BE CLIENT SIDE DUE TO MAPS / GEOLOCATION
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

function Geo({loc}) {
  if (loc) {
    return (
      <Map className="rounded-lg" center={[loc.latitude, loc.longitude]} defaultZoom={14}>
        <Marker width={50} anchor={[loc.latitude, loc.longitude]} color="red"/>
        <ZoomControl />
      </Map>
    )
  } else {
    return (
      <Map className="rounded-lg" defaultCenter={[0, 0]} defaultZoom={14}/>
    )
  }
  
}



// Main Tabs
function MainTabHome({loc}) {
  return (
    <>
    <WelcomeMessage />
    <div className='h-[calc(100%-110px)] m-5 rounded-lg'>
      <Geo loc={loc}/>
    </div>
    </>
  )
}

function MainTabChatRoom({room}) {
  var { register, control, reset, handleSubmit} = useForm()
  const [chats, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  var user
  fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        user = data
      })

  var unsubscribeUpdater
  useEffect(() => {
    unsubscribeUpdater = onValue(ref(database, `/rooms/${room}/chats`), (snapshot) => {
        var chatsArr = []
        var messages = snapshot.val()
        for (var message in messages) {
          chatsArr.push(<Chat chatObj={messages[message]} key={messages[message].timestamp}/>)
        }
        setData(chatsArr.reverse())
        setLoading(false)
    })
  }, [])

  function sendMessage(data) {
    reset()
    var payload = {
      body: data.message,
      user: user.username,
      timestamp: new Date().getTime()
    }
    set(ref(database,`/rooms/${room}/chats/${user.username}-${new Date().getTime()}`), payload)
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

function Home() {
  var [tab, setTab] = useState("nearby")
  var [mainTab, setMainTab] = useState("home")
  var [chatRoom, setChatRoom] = useState("Dev")

  const [myRooms, setRoomData] = useState(null)
  const [isRoomLoading, setRoomLoading] = useState(true)
  useEffect(() => {
        fetch('/api/user').then((res) => res.json())
        .then((user) => {
          get(ref(database, '/users/'+user.uid+'/rooms')).then((snapshot) => {
            var rooms = snapshot.val()
            var roomArr = []
            for (var room in rooms) {
              roomArr.push(<ChatRoomSidebar roomObj={rooms[room]} key={rooms[room]} click={() => {setChatRoom(rooms[room].path+"/"+rooms[room].name+"-"+rooms[room].timestamp);setMainTab("chat")}}/>)
            }
            setRoomData(roomArr)
            setRoomLoading(false)
          })
        })
  }, [])


  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true)
  const [nearby, setNearby] = useState(null);
  const [loadingNearby, setLoadingNearby] = useState(true);
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
              nearbyArr.push(<ChatRoomSidebar roomObj={data[room]} click={() => {setChatRoom(data[room].path+"/"+data[room].name+"-"+data[room].timestamp);setMainTab("chat")}}/>)
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


  return (
    <div className="grid grid-cols-4 auto-cols-max overflow-hidden">
      <div className="col-span-3 h-dvh">
        <div className="m-2 rounded-lg h-[63px] bg-white shadow-2xl grid grid-cols-2 p-1">
          <div className='h-[60px]'>
            <a href="/"><img src="logos/logo_transparent_inverse.png" className='h-[60px]'/></a>
          </div>
          <div className='h-[60px] p-4'>
            {mainTab == "chat" && <a onClick={() => {setMainTab("home")}} className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5">Close Chat</a>}
            <a href="/api/signout" className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full">Sign Out</a>
          </div>
        </div>
        <div className="mr-2 h-[calc(100%-110px)]">
          {(mainTab == "home" && !loadingLoc) && <MainTabHome loc={location}/>}
          {(mainTab == "home" && loadingLoc) && <MainTabHome loc={null}/>}
          {mainTab == "chat" && <MainTabChatRoom room={chatRoom}/>}
        </div>
      </div>
      <div className="h-dvh">
          <div className="bg-white shadow-2xl rounded-lg m-2 h-[98%]">
              <div className='p-2'>
                <div className='p-1 rounded-lg grid grid-cols-3 bg-white'>
                  <div className={tab == "nearby"? 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]': 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]'} onClick={() => {setTab("nearby")}}>Nearby</div>
                  <div className={tab == "rooms"? 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]': 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]'} onClick={() => {setTab("rooms")}}>My Rooms</div>
                  <div className={tab == "create"? 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0] bg-[#D3D3D3]': 'select-none p-1 cursor-pointer rounded-lg hover:bg-[#C0C0C0]'} onClick={() => {setTab("create")}}>Create</div>
                </div>
              </div>
              {tab == "nearby" && <div className='overflow-y-auto h-[90%]'>
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
      </div>
    </div>
  )
}

export default Home;
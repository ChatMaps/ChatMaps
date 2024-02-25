"use client"
import { useState, useEffect } from 'react'
import {Map, Marker, ZoomControl} from "pigeon-maps"
import { Form, useForm } from "react-hook-form";
import { app } from "../api/firebase-config";
import { getDatabase, ref, onValue, get  } from "firebase/database";
var database = getDatabase(app)


function ChatRoomSidebar({roomObj}) {
  return (
    <div className='border-[black] border-1 shadow-lg p-2 m-2 rounded-lg grid grid-cols-3 cursor-pointer'>
      <div className=''>
        Icons
      </div>
      <div className='col-span-2'>
        <div className='font-bold'>{roomObj.name}</div>
        <div className='italic'> x Members</div>
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

function Geo() {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState();
  useEffect(() => {
    if('geolocation' in navigator) {
        // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            const { latitude, longitude } = coords;
            setData(coords)
            setLoading(false)
        })
    }
  }, []);
  if (!isLoading) {
    return (
      <Map className="rounded-lg" center={[data.latitude, data.longitude]} defaultZoom={14}>
        <Marker width={50} anchor={[data.latitude, data.longitude]} color="red"/>
        <ZoomControl />
      </Map>
    )
  } else {
    return (
      <Map className="rounded-lg" defaultCenter={[0, 0]} defaultZoom={14}/>
    )
  }
  
}

function MainTabHome() {
  return (
    <>
    <WelcomeMessage />
    <div className='h-[calc(100%-110px)] m-5 rounded-lg'>
      <Geo />
    </div>
    </>
  )
}

function Chat({chatObj}) {
    return (
      <div key="" className='width-[100%] bg-white rounded-lg mt-1 text-left p-1'>
        {chatObj.user}: {chatObj.body}
      </div>
    )
}

function MainTabChatRoom({chatRoom}) {
  var { register, control, setError, formState: { errors, isSubmitting, isSubmitted } } = useForm()
  const [chats, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  var unsubscribeUpdater
  useEffect(() => {
    unsubscribeUpdater = onValue(ref(database, "/rooms/1"), (snapshot) => {
        var chatsarr = []
        var messages = snapshot.val()
        for (var message in messages) {
          chatsarr.push(<Chat chatObj={messages[message]} key={messages[message].timestamp}/>)
        }
        setData(chatsarr)
        setLoading(false)
    })
  }, [])
  if (isLoading) return <div>Loading</div>
  if (!chats) return <div>No Chats</div>
  return (
    <div className='m-1 h-[100%] rounded-lg'>
      <div className='h-[90%] m-4 overflow-y-auto'>
        {chats}
      </div>
      <div className='m-2 h-[10%] w-[100%] bg-white rounded-lg'>
        <Form control={control} className='w-[100%]'>
          <input type="text" className='w-[81%]'/>
          <button className="p-2 cursor-pointer bg-[#dee0e0] bg-cyan-500 text-white font-bold rounded-full mr-5">Send</button>
        </Form>
      </div>
    </div>
  )
}

function MyRooms() {
  const [myrooms, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  var unsubscribeUpdater
  useEffect(() => {
        fetch('/api/user').then((res) => {
            res.json().then((user) => {
              console.log(user.uid)
              get(ref(database,`/users/${user.uid}/rooms`), (snapshot) => {
                var json = snapshot.val()
                console.log(json)
                var roomsArr = []
                for (var room in json) {
                  console.log(room,json[room])
                  roomsArr.push(<ChatRoomSidebar roomObj={json[room]} id={json[room].name}/>)
                }  
                setData(roomsArr)
                setLoading(false)
              })   
          })
        })
  }, [])
  if (isLoading) return <div>Loading</div>
  if (!myrooms) return <div>No Data</div>
  return (
    <div>
      {myrooms}
    </div>
  )
}

function Home() {
  var [tab, setTab] = useState("nearby")
  var [mainTab, setMainTab] = useState("chat")
  var [chatRoom, setChatRoom] = useState("NA")

  return (
    <div className="grid grid-cols-4 auto-cols-max overflow-hidden">
      <div className="col-span-3 h-page">
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
          {mainTab == "home" && <MainTabHome/>}
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
                Nearby
              </div> }
              {tab == "rooms" && <div className='overflow-y-auto h-[90%]'>
                My Rooms
                <div>
                  <MyRooms/>
                </div>
              </div>}
              {tab == "create" && <div className='overflow-y-auto h-[90%]'>
                Create Room
              </div>}
          </div>
      </div>
    </div>
  )
}

export default Home;
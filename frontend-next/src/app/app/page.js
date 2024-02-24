"use client"
import { useState, useEffect } from 'react'
import {Map, Marker, ZoomControl} from "pigeon-maps"

function Header() {
  return (
      <div className="m-2 rounded-lg h-[60px] bg-white shadow-2xl">
          <a href="/"><img src="/logos/logo_transparent_inverse.png" className="h-[60px]"/></a>
      </div>
  )
}

function Sidebar() {
  var nearbyTab = false
  return (
      <div className="h-dvh">
          <div className="bg-white shadow-2xl rounded-lg m-2 h-[98%]">
              <div className='p-2'>
                <div className='p-1 rounded-lg grid grid-cols-3 bg-white'>
                  <div className='p-1 cursor-pointer rounded-lg bg-[#D3D3D3] hover:bg-white' onClick={() => {nearbyTab = true}}>Nearby</div>
                  <div className='p-1 cursor-pointer rounded-lg hover:bg-[#D3D3D3] bg-white'>My Rooms</div>
                  <div className='p-1 cursor-pointer rounded-lg hover:bg-[#D3D3D3] bg-white'>Create</div>
                </div>
              </div>
              {nearbyTab && <div className='overflow-y-auto h-[90%]'>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General"/>
                <ChatRoomSidebar roomName="Umaine General Last"/>
              </div> }
          </div>
      </div>
    
  )
}

function ChatRoomSidebar({roomName}) {

  return (
    <div className='border-[black] border-1 shadow-lg p-2 m-2 rounded-lg grid grid-cols-3 cursor-pointer'>
      <div className=''>
        Icons
      </div>
      <div className='col-span-2'>
        <div className='font-bold'>{roomName}</div>
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

function Home() {
  return (
    <div className="grid grid-cols-4 auto-cols-max overflow-hidden">
      <div className="col-span-3 h-page">
        <Header/>
        <div className="h-[calc(100%-75px)]">
          <WelcomeMessage/>
          <div className='h-[calc(100%-110px)] m-5 rounded-lg'>
            <Geo/>
          </div>
        </div>
      </div>
      <Sidebar/>
    </div>
  )
}



export default Home;
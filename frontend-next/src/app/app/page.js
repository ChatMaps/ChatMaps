"use client"
import { useState, useEffect } from 'react'
import {Map} from "pigeon-maps"

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
        Welcome, {data.firstName} {data.lastName}
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
            console.log(latitude, longitude)
            setData(coords)
            setLoading(false)
        })
    }
  }, []);
  if (!isLoading) {
    return (
      <Map className="rounded-lg" defaultCenter={[data.latitude, data.longitude]} defaultZoom={14}/>
    )
  } else {
    return (
      <div>Loading...</div>
    )
  }
  
}

function Home() {
  return (
    <div className="h-[calc(100%-75px)]">
      <WelcomeMessage/>
      <div className='h-[calc(100%-110px)] m-5 rounded-lg'>
        <Geo/>
      </div>
    </div>
  )
}



export default Home;
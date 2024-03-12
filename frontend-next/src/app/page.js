"use client"
import { useState, useEffect } from 'react'

import { app } from "./api/firebase-config";
import { getDatabase, ref, get} from "firebase/database";

var database = getDatabase(app)


function Home() {
    const [statusCode, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [isLoadingLoc, setLoadingLoc] = useState(true)
    const [roomCount, setRoomCount] = useState(null)
    useEffect(() => {
      fetch('/api/user')
        .then((res) => res.status)
        .then((status) => {
          setData(status)
          setLoading(false)
        })
    }, [])

    useEffect(() => {
        if('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
              var path = String(coords.latitude.toFixed(2)).replace(".","")+"/"+String(coords.longitude.toFixed(2)).replace(".","")
              get(ref(database, `/rooms/${path}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    var count = 0
                    for (var room in snapshot.val()) {
                        count += 1
                    }
                    setRoomCount(count)
                } else {
                    console.log("No rooms nearby")
                    setRoomCount(0)
                }
                setLoadingLoc(false)
              });
        });
          }
    })
    return (
        <div>
            <div className="grid h-screen place-items-center">
                <div>
                    <img src="logos/logo_transparent_inverse.png"/>
                    <span className="text-[36px]">
                        Chat with friends!
                    </span>
                    <div className="m-5">
                        {(statusCode == 203 || isLoading) && 
                            <div>
                                <a href="/login"><button className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">Login</button></a>
                                <a href="/register"><button className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">Sign Up</button></a>
                            </div>
                        }
                        {statusCode == 200 &&  <a href="/app"><button className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">Continue to App</button></a>}
                        {(!isLoadingLoc && roomCount != 0) && <div className='text-[24px] pt-10'>Join others in {roomCount} rooms near you!</div>}
                        {(isLoadingLoc || (roomCount == 0 && !isLoadingLoc)) && <div className='text-[24px] pt-10'>Start the conversation today!</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
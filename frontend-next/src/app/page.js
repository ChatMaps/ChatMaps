"use client"
import { useState, useEffect } from 'react'


function Home() {
    const [statusCode, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
      fetch('/api/user')
        .then((res) => res.status)
        .then((status) => {
          setData(status)
          setLoading(false)
        })
    }, [])
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
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
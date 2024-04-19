import {useEffect, useState} from "react";

import {database} from "../../../../firebase-config";
import {get, ref} from "firebase/database";
import { useForm } from "react-hook-form"
import { ChatRoomSidebar } from "../datatypes";


export function NearbySidebar({location}) {
    const [nearbyArr, setNearbyArr] = useState([])
    const [displayedRooms, setDisplayedRooms] = useState([])
    const [nearbyArrReady, setNearbyArrReady] = useState(false)
    const {register, watch, setFocus} = useForm({defaultValues: {search: null}})

    // Search Bar Value
    const search = watch("search")

    // Search Bar Component
    function SearchBar() {
        return (
            <div className="w-[97%]">
                <input type="text" placeholder="Search" {...register("search")} className="w-full p-2 border-2 border-gray-300 rounded-lg col-span-3" value={null} />
            </div>
        )
    }

    // Filters Rooms Based on Search
    useEffect(() => {
        if (search != "") {
            var rooms = []
            for (var nearbyRoom in nearbyArr) {
                if (nearbyArr[nearbyRoom].props.roomObj.name.toLowerCase().includes(search.toLowerCase()) || nearbyArr[nearbyRoom].props.roomObj.description.toLowerCase().includes(search.toLowerCase())) {
                    rooms.push(<ChatRoomSidebar roomObj={nearbyArr[nearbyRoom].props.roomObj} key={nearbyArr[nearbyRoom].props.roomObj.timestamp}/>)
                }
            }
        } else {
            rooms = nearbyArr
        }
        setDisplayedRooms(rooms)
    }, [search])

    // Returns cursor to search bar on render
    useEffect(() => {
        setFocus("search")
    }, [displayedRooms])

    // Sets Initial Array of Nearby Rooms
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
                nearbyArr.push()
              }
              setNearbyArr(nearbyArr)
              setDisplayedRooms(nearbyArr)
              setNearbyArrReady(true)
          })
        }
      }, [location])


      return (
        <div>
            <SearchBar/>
            {nearbyArrReady && displayedRooms}
            {!nearbyArrReady && <div>Loading...</div>}
            {nearbyArrReady && nearbyArr.length === 0 && <div className="pt-5">No Nearby Rooms<br />Create One?</div>}
        </div>
      )
}
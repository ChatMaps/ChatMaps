"use client";
import { useState, useEffect } from "react";
import Link from "next/link"
import { auth, database } from "../../firebase-config";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

function Home() {
  const [isLoadingLoc, setLoadingLoc] = useState(true);
  const [roomCount, setRoomCount] = useState(null);
  const [isAuthenticated, setAuth] = useState(false);

  // Authentication
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuth(true);
      } else {
        setAuth(false);
      }
    });
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        var path =
          String(coords.latitude.toFixed(2)).replace(".", "") +
          "/" +
          String(coords.longitude.toFixed(2)).replace(".", "");
        get(ref(database, `/rooms/${path}`)).then((snapshot) => {
          if (snapshot.exists()) {
            var count = 0;
            for (var room in snapshot.val()) {
              count += 1;
            }
            setRoomCount(count);
          } else {
            setRoomCount(0);
          }
          setLoadingLoc(false);
        });
      });
    }
  });
  return (
    <div>
      <div className="grid h-screen place-items-center">
        <div>
          <img src="logos/logo_transparent_inverse.png" />
          <span className="text-[36px]">Chat with friends!</span>
          <div className="m-5">
            {!isAuthenticated && (
              <div>
                <Link href="/login">
                  <button className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">
                    Register
                  </button>
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <Link href="/app">
              <button className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">
                Continue to App
              </button>
            </Link>
            )}
            {!isLoadingLoc && roomCount == 1 && (
              <div className="text-[24px] pt-10">
                Join others in {roomCount} room near you!
              </div>
            )}
            {!isLoadingLoc && roomCount != 1 && roomCount != 0 && (
              <div className="text-[24px] pt-10">
                Join others in {roomCount} rooms near you!
              </div>
            )}
            {(isLoadingLoc || (roomCount == 0 && !isLoadingLoc)) && (
              <div className="text-[24px] pt-10">
                Start the conversation today!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

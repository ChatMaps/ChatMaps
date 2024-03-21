import { useState, useEffect } from "react";


import {Geo} from "../datatypes"

// Module for Welcome Message on main tab landing page
function WelcomeMessage() {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        });
    }, []);
    if (isLoading) return <div></div>;
    if (!data) return <div></div>;
  
    return (
      <div className="bg-white rounded-lg m-2 mt-4 text-left p-2 pl-5">
        <div>
          Welcome, {data.firstName} {data.lastName} ({data.username})
        </div>
        <div>Lets see what&apos;s happening in your area.</div>
      </div>
    );
  }

// Primary App Landing Page
export function MainTabHome({ loc, markers }) {
    return (
      <>
        <WelcomeMessage />
        <div className="h-[calc(100%-110px)] m-5 rounded-lg">
          <Geo
            loc={loc}
            zoom={14}
            movable={true}
            locMarker={true}
            markers={markers}
          />
        </div>
      </>
    );
  }
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { database } from "../../../../firebase-config";
import { ref, get } from "firebase/database";
import { useState, useEffect } from "react";


// ONLY nearby markers
function NearbyRoomMarkers({ loc, user }) {
  const [markerArr, setMarkerArr] = useState([]);

  // Room path in DB
  const path =
    String(loc.latitude.toFixed(2)).replace(".", "") +
    "/" +
    String(loc.longitude.toFixed(2)).replace(".", "") +
    "/";

  // Sorry for the href but <Link> doesn't work here
  const handleMarkerClick = (name) => {
    window.location.href = "/chat?room=" + path + name;
  };

  useEffect(() => {
    if (loc && user) {
      get(ref(database, `/rooms/${path}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const rooms = snapshot.val();

          const newMarkers = Object.values(rooms).map((roomObj, index) => {
            const markerKey = roomObj.path + "-" + index;

            return (
              <Marker
                key={markerKey}
                anchor={[roomObj.latitude, roomObj.longitude]}
                color="blue"
                onClick={() => handleMarkerClick(roomObj.name)}
              ></Marker>
            );
          });
          setMarkerArr(newMarkers);
        }
      });
    }
  }, []);

  return markerArr;
}

/**
 * Geo Component for Wrapping Map
 * @constructor
 * @prop {JSON} loc - Location Object {latitude, longitude}
 * @prop {Number} zoom - Zoom Level
 * @prop {Boolean} locMarker - Show Location Marker
 * @returns {Map} - Geo Component (As Map)
 */
export function Geo({ loc, zoom, moveable, markers, user }) {
  if (!loc) {
    return <div>Getting Location...</div>;
  } else {
    return (
      <>
        <Map center={[loc.latitude, loc.longitude]} defaultZoom={zoom}>
          {zoom && <ZoomControl />}
          {user && ( // Shows the user marker
            <Marker anchor={[loc.latitude, loc.longitude]} color="red" />
          )}
          {NearbyRoomMarkers({ loc, user })}
        </Map>
      </>
    );
  }
}

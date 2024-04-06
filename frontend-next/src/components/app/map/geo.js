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
  const handleRoomMarkerClick = (roomObj) => {
    window.location.href =
      "/chat?room=" + path + roomObj.name + "-" + roomObj.timestamp;
  };

  // Mostly copied Nick's code from before
  useEffect(() => {
    if (loc && user) {
      get(ref(database, `/rooms/${path}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const rooms = snapshot.val();

          const newMarkers = Object.values(rooms).map((roomObj, index) => {
            const markerKey = roomObj.path + "-" + index;
            return (
              // Want to change this to be something other than markers (or something extra)
              <Marker
                key={markerKey}
                anchor={[roomObj.latitude, roomObj.longitude]}
                color="blue"
                onClick={() => handleRoomMarkerClick(roomObj)}
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
 * @prop {Boolean} moveable - Moveable Map
 * @prop {Boolean} markers - Enable Markers
 * @returns {Map} - Geo Component (As Map)
 */
export function Geo({ loc, zoom, moveable, markers, user }) {
  const handleUserMarkerClick = () => {
    window.location.href = "/user?uid=" + user.uid;
  }

  if (!loc) {
    return <div>Getting Location...</div>;
  } else {
    return (
      <>
        <Map
          center={[loc.latitude, loc.longitude]}
          defaultZoom={zoom}
          mouseEvents={moveable}
          touchEvents={moveable}
        >
          {zoom && <ZoomControl />}
          {markers && NearbyRoomMarkers({ loc, user })}
          {user && ( // Shows the user marker
            <Marker anchor={[loc.latitude, loc.longitude]} color="red" onClick={handleUserMarkerClick} />
          )}
        </Map>
      </>
    );
  }
}

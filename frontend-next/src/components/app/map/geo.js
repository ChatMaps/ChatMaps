import { Map, Marker, ZoomControl, Overlay } from "pigeon-maps";
import { database } from "../../../../firebase-config";
import { ref, get} from "firebase/database";
import { useState } from "react";
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import { red } from '@mui/material/colors';

/**
 * Nearby Markers Grabber
 * @param {JSON} location - Location Object {latitude, longitude}
 * @returns {Array} - Array of Markers {<Marker>}
 */
function NearbyMarkers(location) {
  const [newMarkers, setNewMarkers] = useState(null);
  if (location) {
    const path = String(location.latitude.toFixed(2)).replace(".", "") +"/" +String(location.longitude.toFixed(2)).replace(".", "") +"/";
    get(ref(database, `/rooms/${path}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const rooms = snapshot.val();
        setNewMarkers(rooms)
      }
    })
  }
  return newMarkers;
}

/**
 * Friend Markers Grabber
 * @param {JSON} user - User Object
 * @returns {Array} - Array of Markers {<Marker>}
 */
function FriendMarkers(user) {
  var friendMarkers = []
  if (user && "friends" in user && "friends" in user.friends) {
    for (var friend in user.friends.friends) {
      get(ref(database, `/users/${friend}`)).then((snapshot) => {
        var friendData = snapshot.val();
        if (friendData.location) {
          friendMarkers.push(friendData);
        }
      });
    }
  }
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
export function Geo({ loc, zoom, moveable, user }) {
  const [hovering, setHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [hoverAnchor, setHoverAnchor] = useState([null,null]);
  
  if (moveable) {
    if (user.rooms) {
      // Load My Rooms Markers
      var myRoomsMarkers = Object.values(user.rooms).map((roomObj) => {
        return (<Marker
          key={roomObj.path + "-" + roomObj.name}
          anchor={[roomObj.latitude, roomObj.longitude]}
          onClick={() => {window.location.href = "/chat?room=" + roomObj.path + "/" + roomObj.name + "-" + roomObj.timestamp;}}
          style={{pointerEvents:'auto'} /* So stupid */}
          onMouseOver={() => {setHoverText(roomObj.name);setHovering(true);setHoverAnchor([roomObj.latitude, roomObj.longitude])}}
          onMouseOut={() => {setHovering(false)}}
        >
          <ChatBubbleTwoToneIcon color="primary" fontSize="large"/>
        </Marker>)
      })
    }
  

    // Load Nearby Markers
    var nearbyMarkers = null;
    if (loc) {
      const path = String(loc.latitude.toFixed(2)).replace(".", "") +"/" +String(loc.longitude.toFixed(2)).replace(".", "") +"/";
      get(ref(database, `/rooms/${path}`)).then((snapshot) => {
        if (snapshot.exists()) {
          nearbyMarkers = snapshot.val();
          if (nearbyMarkers) {
            var nearbyMarkers = Object.values(nearbyMarkers).map((roomObj) => {
              return (<Marker
                key={roomObj.path + "-" + roomObj.name}
                anchor={[roomObj.latitude, roomObj.longitude]}
                onClick={() => {window.location.href = "/chat?room=" + roomObj.path + "/" + roomObj.name + "-" + roomObj.timestamp;}}
                style={{pointerEvents:'auto'} /* So stupid */}
                onMouseOver={() => {setHoverText(roomObj.name);setHovering(true);setHoverAnchor([roomObj.latitude, roomObj.longitude])}}
                onMouseOut={() => {setHovering(false)}}
              >
                <ChatBubbleTwoToneIcon color="secondary" fontSize="large"/>
              </Marker>)
            })
          }
        }
      })
    }
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
          attribution={false}
        >
          {zoom && <ZoomControl />}
          {moveable && nearbyMarkers}
          {moveable && myRoomsMarkers}

          { /* Overlay */}
          {hovering && (
            <Overlay anchor={hoverAnchor} offset={[0, 0]}>
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg">{hoverText}</p>
              </div>
            </Overlay>
          )}

          {user && ( // Shows the user marker
            <Marker
              anchor={[loc.latitude, loc.longitude]}
              color="red"
              style={{pointerEvents:'auto'} /* So stupid */}
            >
              <PersonOutlineTwoToneIcon sx={{ color: red[500] }} fontSize="large"/>
            </Marker>
          )}
        </Map>
      </>
    );
  }
}

import { Map, Marker, ZoomControl, Overlay } from "pigeon-maps";
import { database } from "../../../../firebase-config";
import { ref, get} from "firebase/database";
import { useState, useEffect } from "react";
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import { red } from '@mui/material/colors';


function NearbyMarkers(location) {
  const [newMarkers, setNewMarkers] = useState(null);
  if (location) {
    const path = String(location.latitude.toFixed(2)).replace(".", "") +"/" +String(location.longitude.toFixed(2)).replace(".", "") +"/";
    get(ref(database, `/rooms/${path}`)).then((snapshot) => {
      const rooms = snapshot.val();
      var newMarkersArr = Object.values(rooms).map((roomObj, index) => {
        return (
          // Want to change this to be something other than markers (or something extra)
          <Marker
            key={roomObj.path + "-" + index}
            anchor={[roomObj.latitude, roomObj.longitude]}
            onClick={() => (roomObj) => {window.location.href = "/chat?room=" + path + roomObj.name + "-" + roomObj.timestamp;}}
            style={{pointerEvents:'auto'} /* So stupid */}
          >
            <ChatBubbleTwoToneIcon color="secondary" fontSize="large"/>
          </Marker>
        );
      }); 
      setNewMarkers(newMarkersArr)
    })
  }
  return newMarkers;
}

function MyRoomsMarkers(user) {
    var myRoomsMarkers = Object.values(user.rooms).map((roomObj) => {
    return (<Marker
      key={roomObj.path + "-" + roomObj.name}
      anchor={[roomObj.latitude, roomObj.longitude]}
      onClick={() => (roomObj) => {window.location.href = "/chat?room=" + path + roomObj.name + "-" + roomObj.timestamp;}}
      style={{pointerEvents:'auto'} /* So stupid */}
    >
      <ChatBubbleTwoToneIcon color="primary" fontSize="large"/>
    </Marker>)
  })
  return myRoomsMarkers;
}

function FriendMarkers(user) {

  var friendMarkers = []
  for (var friend in user.friends.friends) {
    get(ref(database, `/users/${friend}`)).then((snapshot) => {
      var friendData = snapshot.val();
      if (friendData.location) {
        friendMarkers.push(<Marker
          anchor={[friendData.location.latitude, friendData.location.longitude]}
          onClick={() => (friendData) => {window.location.href = "/user?uid=" + friendData.uid;}}
          style={{pointerEvents:'auto'} /* So stupid */}>
            <img src={friendData.pfp} className="w-[50px]"/>
          </Marker>);
      }
    });
  }

  return friendMarkers;
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
  };

  // SCUFFED AF
  //var rooms = NearbyRoomMarkers({ loc, user, markers });

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
          {NearbyMarkers(loc)}
          {MyRoomsMarkers(user)}
          {FriendMarkers(user)}
          {user && ( // Shows the user marker
            <Marker
              anchor={[loc.latitude, loc.longitude]}
              color="red"
              onClick={handleUserMarkerClick}
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

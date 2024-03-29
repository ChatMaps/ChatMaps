import { Map, Marker, ZoomControl } from "pigeon-maps";

// Colors for Messages
const userColors = [
    "#ff80ed",
    "#065535",
    "#133337",
    "#ffc0cb",
    "#e6e6fa",
    "#ffd700",
    "#ffa500",
    "#0000ff",
    "#1b85b8",
    "#5a5255",
    "#559e83",
    "#ae5a41",
    "#c3cb71",
  ];

// Chat Message
export function Chat({ chatObj }) {
    let dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
  
    const generateColor = (user_str) => {
      // hashes username for consistent colors, maybe all functionality to pick color later
      let hash = 0;
      for (let i = 0; i < user_str.length; i++) {
        hash = user_str.charCodeAt(i) + (hash * 32 - hash);
      }
      const index = Math.abs(hash) % userColors.length;
      return index;
    };
  
    return (
      <div className="width-[100%] bg-white rounded-lg mt-1 text-left p-1 grid grid-cols-2 mr-2">
        <div>
          <span style={{ color: userColors[generateColor(chatObj.user)] }}>
            {chatObj.user}
          </span>
          : {chatObj.body}
        </div>
        <div className="text-right text-[#d1d1d1]">
          {new Date(chatObj.timestamp).toLocaleString(dateOptions)}
        </div>
      </div>
    );
  }
  
// System Chat Message
export function SystemMessage({ chatObj }) {
let dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
};

const generateColor = (user_str) => {
    // hashes username for consistent colors, maybe all functionality to pick color later
    let hash = 0;
    for (let i = 0; i < user_str.length; i++) {
    hash = user_str.charCodeAt(i) + (hash * 32 - hash);
    }
    const index = Math.abs(hash) % userColors.length;
    return index;
};

return (
    <div className="width-[100%] bg-white rounded-lg mt-1 text-left p-1 grid grid-cols-2 mr-2">
    <div className="text-[#d1d1d1]">
        <span style={{ color: userColors[generateColor(chatObj.user)] }}>
        {chatObj.user}
        </span>{" "}
        has {chatObj.body} the room.
    </div>
    <div className="text-right text-[#d1d1d1]">
        {new Date(chatObj.timestamp).toLocaleString(dateOptions)}
    </div>
    </div>
);
}
  
// Member for Active/Room members in sidebar
export function Member({ memberObj }) {
    return (
      <div className="cursor-pointer g-[aliceblue] rounded-lg m-3 shadow-xl p-2">
        {memberObj.username}
      </div>
    );
  }

// Chat Room Object for myRooms and Nearby in sidebar
export function ChatRoomSidebar({ roomObj, click }) {
    // TODO: Gross fix but it works
    function clicker() {
      click(roomObj);
    }
    return (
      <div
        onClick={clicker}
        className="border-[black] border-1 shadow-lg p-2 m-2 rounded-lg cursor-pointer"
      >
        <div className="col-span-2">
          <div className="font-bold">{roomObj.name}</div>
          <div className="italic">{roomObj.description}</div>
        </div>
      </div>
    );
  }

// Map module for main page and chat room sidebar
// TODO: MAKE NOT MOVABLE
export function Geo({ loc, zoom, locMarker, markers }) {
    if (loc) {
      return (
        <Map center={[loc.latitude, loc.longitude]} defaultZoom={zoom}>
          {markers && markers}
          {locMarker && (
            <Marker
              width={30}
              anchor={[loc.latitude, loc.longitude]}
              color="red"
            />
          )}
          {zoom && <ZoomControl />}
        </Map>
      );
    } else {
      return (
        <Map className="rounded-lg" defaultCenter={[0, 0]} defaultZoom={zoom} />
      );
    }
  }
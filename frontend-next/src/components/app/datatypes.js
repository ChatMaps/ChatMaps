import Link from "next/link"
import { useEffect, useState } from "react";
const Filter = require('bad-words')
const filter = new Filter();

// Icons
import PersonIcon from '@mui/icons-material/Person';
import CircleIcon from '@mui/icons-material/Circle';

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

let dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

/**
 * Rich Message Formatting
 * @param {String} message - Message to Format
 * @returns {String} - Formatted Message (IN HTML)
 */
function RMF(message) {
  var IMG_END = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
  var URLREGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  var URLmatch = message.match(URLREGEX);
  var newMessage = []
  if (URLmatch) {
    for (var i = 0; i < URLmatch.length; i++) {
      if (IMG_END.includes(URLmatch[i].slice(-4)) || IMG_END.includes(URLmatch[i].slice(-5))) {
        // Its a photo
        newMessage.push((<img src={"https://"+URLmatch[i]} className="max-w-[100%] max-h-[100%]"/>))
      } else {
        console.log(message)
        newMessage.push((<span className="mr-2">
          {URLmatch.length == 1 && message.split(URLmatch[i])[0]}
          <Link href={"https://"+URLmatch[i]} target="_blank" className="hover:underline">{URLmatch[i]}</Link>
          {(i == URLmatch.length || URLmatch.length == 1) && message.split(URLmatch[i])[1]}
        </span>))
      }
      
    }
  }
  return newMessage
}
/**
 * Grabs Window Size
 * @returns {Object} - Window Size Object (width, height)
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

/**
 * Generates Color based on string hash
 * @param {String} user_str - Username / String for hashing
 * @returns {String} - Color Hex Code Index in userColors
 */
const generateColor = (user_str) => {
  // hashes username for consistent colors, maybe all functionality to pick color later
  let hash = 0;
  for (let i = 0; i < user_str.length; i++) {
    hash = user_str.charCodeAt(i) + (hash * 32 - hash);
  }
  const index = Math.abs(hash) % userColors.length;
  return index;
};


/**
 * Chat Message Object
 * @props {JSON} chatObj - Chat Object
 * @returns {Object} - Chat Message Component
 */
export function Chat({ chatObj }) {
  var message = RMF(chatObj.body)
  if (message)
    message = filter.clean(message)
  return (
    <div className="width-[100%] bg-white rounded-lg mt-1 text-left p-1 grid grid-cols-2 mr-2">
      <div>
        <span style={{ color: userColors[generateColor(chatObj.user)] }}>
          <Link href={`/user?uid=${chatObj.uid}`}
          className="hover:font-bold cursor-pointer">
            {chatObj.user}
          </Link>
        </span>
        : {message}
      </div>
      <div className="text-right text-[#d1d1d1]">
        {new Date(chatObj.timestamp).toLocaleString(dateOptions)}
      </div>
    </div>
  );
}


/**
 * System Chat Message Object
 * @prop {JSON} chatObj - Chat Object
 * @returns {Object} - System Chat Message Component
 */
export function SystemMessage({ chatObj }) {
  return (
    <div className="width-[100%] bg-white rounded-lg mt-1 text-left p-1 grid grid-cols-2 mr-2">
      <div className="text-[#d1d1d1]">
        <span style={{ color: userColors[generateColor(chatObj.user)] }}>
          <Link href={`/user?uid=${chatObj.uid}`}
          className="hover:font-bold cursor-pointer">
            {chatObj.user}
          </Link>
        </span>{" "}
        has {chatObj.body} the room.
      </div>
      <div className="text-right text-[#d1d1d1]">
        {new Date(chatObj.timestamp).toLocaleString(dateOptions)}
      </div>
    </div>
  );
}

/**
 * Member Object for Sidebar
 * @prop {JSON} memberObj - Member Object
 * @returns {Object} - Member Component
 */
export function Member({ memberObj }) {
  return (
    <Link href={"/user?uid=" + memberObj.uid}>
      <div className="cursor-pointer g-[aliceblue] rounded-lg m-3 shadow-xl p-2">
      {memberObj.lastOnline == true && <CircleIcon className="text-lime-600 mr-1 relative top-[-1px]" fontSize="20px"/>}{memberObj.username}
      </div>
    </Link>
  );
}

/**
 * Chat Room Object for Sidebar
 * @prop {JSON} roomObj - Room Object
 * @returns {Object} - Chat Room Component
 */
export function ChatRoomSidebar({ roomObj }) {
  const [isRoomHovered, setIsRoomHovered] = useState(false);

  if ("users" in roomObj) {
    if ("online" in roomObj.users) {
      var roomOnline = Object.keys(roomObj.users.online).length
    } else {
      var roomOnline = 0
    }
    if ("all" in roomObj.users) {
      var roomTotal = Object.keys(roomObj.users.all).length
    } else {
      var roomTotal = 0
    }
  } else {
    var roomOnline = 0
    var roomTotal = 0
  }
  const handleMouseEnter = () => {
    setIsRoomHovered(true);
  };

  const handleMouseLeave = () => {
    setIsRoomHovered(false);
  };

  return (
    <div className="border-[black] border-1 shadow-lg p-2 m-2 rounded-lg cursor-pointer">
      <Link href={`/chat?room=${roomObj.path}/${roomObj.name}-${roomObj.timestamp}`}>
        <div className="grid grid-cols-3">
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <PersonIcon/>
            {isRoomHovered && roomObj.users && (
              <div 
                className="fixed bg-white p-2 shadow-md"
              >
                <ul>
                  {Object.values(roomObj.users.all).map((user, index) => ( // I hate making lists like this
                    <li key={index}>{user.username}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>{roomOnline} / {roomTotal}</div>
          </div>
          <div className="col-span-2">
            <div className="font-bold">{roomObj.name}</div>
            <div className="italic">{roomObj.description}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// This will be removed once dateOptions is no longer used in this file
export { dateOptions };
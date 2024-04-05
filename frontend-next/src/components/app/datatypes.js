import Link from "next/link"
import { useEffect, useState } from "react";

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
  return (
    <div className="width-[100%] bg-white rounded-lg mt-1 text-left p-1 grid grid-cols-2 mr-2">
      <div>
        <span style={{ color: userColors[generateColor(chatObj.user)] }}>
          <Link href={`/user?uid=${chatObj.uid}`}
          className="hover:font-bold cursor-pointer"
          target="_blank">
            {chatObj.user}
          </Link>
        </span>
        : {chatObj.body}
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
          className="hover:font-bold cursor-pointer"
          target="_blank">
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
    <Link href={"/user?uid=" + memberObj.uid} target="_blank">
      <div className="cursor-pointer g-[aliceblue] rounded-lg m-3 shadow-xl p-2">
        {memberObj.username}
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
  return (
    <div className="border-[black] border-1 shadow-lg p-2 m-2 rounded-lg cursor-pointer">
      <Link href={`/chat?room=${roomObj.path}/${roomObj.name}-${roomObj.timestamp}`}>
        <div className="col-span-2">
          <div className="font-bold">{roomObj.name}</div>
          <div className="italic">{roomObj.description}</div>
        </div>
      </Link>
    </div>
  );
}

// This will be removed once dateOptions is no longer used in this file
export { dateOptions };
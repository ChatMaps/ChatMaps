import { Geo } from "../map/geo";
import Link from "next/link"
import { dateOptions } from "../datatypes";

// Display of Rooms on user profile
export function ProfileRoom({ room }) {
  return (
    <div className="rounded-lg p-2 shadow-xl bg-white h-[250px] w-[325px]">
      <div className="relative z-1 h-[235px] opacity-50">
        <Geo
          loc={{ latitude: room.latitude, longitude: room.longitude }}
          zoom={12}
          locMarker={false}
        />
      </div>
      <div className="relative z-2 top-[-235px] text-left p-2">
        <div className="text-2xl font-bold">{room.name}</div>
        <div>{room.description}</div>
        <div>
          Created on {new Date(room.timestamp).toLocaleString(dateOptions)}
        </div>
        <Link
          href={
            "/chat?room=" + room.path + "/" + room.name + "-" + room.timestamp
          }
          className="absolute z-2 top-[190px] w-[108px] p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full flex items-center"
        >
          Open Room
        </Link>
      </div>
    </div>
  );
}

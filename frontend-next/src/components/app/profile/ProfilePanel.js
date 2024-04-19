// System Imports
import { Popover } from "@headlessui/react";
import Link from "next/link"

// Firebase Imports
import { auth, database } from "../../../../firebase-config";
import { signOut } from "firebase/auth";
import {update, ref, serverTimestamp} from "firebase/database";

/**
 * Logs out from Firebase Authentication
 * @returns {void}
 */
function logout() {
  signOut(auth);
}

/**
 * Profile Panel Component
 * @prop {JSON} user - User Object
 * @returns {Object} - Profile Panel Component
 */
export function ProfilePanel({user}) {
    return (
      <Popover className="relative">
        <Popover.Button as="div">
          <div className="h-[44px] p-[2px] pr-[15px] cursor-pointer bg-cyan-500 text-white font-bold rounded-full shadow-2xl flex">
            <div className="flex items-center pl-1">{user.firstName}</div>
            <div className="ml-3 rounded-lg flex items-center">
              <img
                src={user.pfp}
                style={{maxWidth: "40px", maxHeight: "40px"}}
                className="relative mx-auto rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </Popover.Button>

        <Popover.Panel className="absolute z-10 bg-white mt-[4px] rounded-xl ml-3 shadow-2xl">
          <div className="grid grid-cols-1">
            <Link
              className="rounded-xl p-4 hover:bg-[#C0C0C0]"
              href={"/user?uid=" + user.uid}
            >
              View Profile
            </Link>
            <div className="rounded-xl p-4 hover:bg-[#C0C0C0] cursor-pointer"
            onClick={() => {
              // Toggle Invisible Status
              update(ref(database, `/users/${user.uid}`), {
                invisibleStatus: user.invisibleStatus? !user.invisibleStatus: true,
                lastOnline: user.invisibleStatus? true: serverTimestamp()
              }
              );
            }}
            >
              {user.invisibleStatus ? "Go Online" : "Go Invisible"}
            </div>
            <Link
              className="rounded-xl p-4 hover:bg-[#C0C0C0]"
              onClick={logout}
              href="/"
            >
              Sign Out
            </Link>
          </div>
        </Popover.Panel>
      </Popover>
    )
}
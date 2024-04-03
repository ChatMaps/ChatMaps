import { Popover } from "@headlessui/react";
import { auth } from "../../../../firebase-config";
import { signOut } from "firebase/auth";
import Link from "next/link"


function logout() {
  signOut(auth);
}

export function ProfilePanel({user}) {
    return (
      <Popover className="relative">
        <Popover.Button as="div">
          <div className="mr-5 h-[44px] p-[2px] pr-[15px] cursor-pointer bg-cyan-500 text-white font-bold rounded-full shadow-2xl flex">
            <div className="flex items-center pl-1">{user.firstName}</div>
            <div className="ml-3 rounded-lg">
              <img
                src={user.pfp}
                width="40px"
                className="relative mx-auto rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </Popover.Button>

        <Popover.Panel className="absolute z-10 bg-white mt-[4px] rounded-xl ml-3 shadow-2xl">
          <div className="grid grid-cols-1">
            <Link
              className="rounded-xl p-4 hover:bg-[#C0C0C0]"
              href={"/user/" + user.uid}
            >
              View Profile
            </Link>
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
// Firebase Imports
import { database } from "../../../../firebase-config"
import { ref, set, get } from "firebase/database";

import ChatIcon from '@mui/icons-material/Chat';


export function openDM(user, uid) {
    var uid1 = user.uid < uid? user.uid : uid
    var uid2 = user.uid > uid? user.uid : uid
    get(ref(database, `dms/${uid1}-${uid2}`)).then((snapshot) => {
        if (snapshot.exists()) {
            window.location.href = `/dm?dm=${uid1}-${uid2}`
        } else {
            createDM(user, uid)
            window.location.href = `/dm?dm=${uid1}-${uid2}`
        }
    });
}


export function createDM(user, uid) {
    var uid1 = user.uid < uid? user.uid : uid
    var uid2 = user.uid > uid? user.uid : uid
    set(ref(database, `dms/${uid1}-${uid2}`), {
        initUID: user.uid,
        targetUID: uid,
        room: uid1 + '-' + uid2,
        UIDs: [user.uid, uid]
    })
}

/**
 * 
 * @param {JSON} friendObj - Friend Object (user) 
 * @returns DM Component
 */
export function DM({user,friendObj}) {
    return (
        <div className="border-[black] border-1 shadow-lg m-2 rounded-lg">
                <div className='grid grid-cols-4'>
                    <div className='place-content-center'>
                        <ChatIcon className='cursor-pointer' onClick={() => {openDM(user,friendObj.uid)}}/>
                    </div>
                    <div className='col-span-3 cursor-pointer'>
                        <div onClick={() => {openDM(user,friendObj.uid)}}>
                            <div className='inline-block mr-5'><img src={friendObj.pfp} className='w-[50px]'/></div>
                            <div className='inline-block relative top-[-6px]'>
                                <div className="font-bold">{friendObj.firstName} {friendObj.lastName}</div>
                                <div className="">@{friendObj.username}</div>
                            </div>
                        </div>
                    </div>
                </div>
      </div>
    )
}
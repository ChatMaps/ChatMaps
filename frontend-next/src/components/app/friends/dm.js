// Firebase Imports
import { database } from "../../../../firebase-config"
import { ref, set, get } from "firebase/database";

import ChatIcon from '@mui/icons-material/Chat';


export function openDM(user, uid) {
    get(ref(database, `dms/`)).then((snapshot) => {
        var dmsList = snapshot.val();
        for (var dmRoom in dmsList) {
            if (user.uid in dmsList[dmRoom].UIDs && uid in dmsList[dmRoom].UIDs) {
                window.location.href = `/dm?dm=${dmRoom}`
            }
        }
        createDM(user, uid)
        window.location.href = `/dm?dm=${user.uid}-${uid}`
    });
}


export function createDM(user, uid) {
    set(ref(database, `dms/${user.uid}-${uid}`), {
        initUID: user.uid,
        targetUID: uid,
        room: user.uid + "-" + uid,
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
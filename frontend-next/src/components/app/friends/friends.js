import Link from 'next/link'

// Icons
import ChatIcon from '@mui/icons-material/Chat';

// Firebase Imports
import { database } from "../../../../firebase-config"
import { ref, set } from "firebase/database";

import { openDM } from './dm';

// Icons
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';

/**
 * Send a friend request to a user
 * @param {JSON} user - User Object 
 * @param {JSON} uid - User ID of the user to send a friend request to
 */
export function addFriend(user, uid) {
    // Add to user's friend requests
    set(ref(database, `users/${uid}/friends/requests/${user.uid}`), {
        uid: user.uid
    })
}

/**
 * 
 * @param {JSON} friendObj - Friend Object (user) 
 * @returns Friend Component
 */
export function Friend({user,friendObj}) {
    return (
        <div className="border-[black] border-1 shadow-lg m-2 rounded-lg">
                <div className='grid grid-cols-4'>
                    <div className='place-content-center'>
                        <ChatIcon className='cursor-pointer' onClick={() => {openDM(user,friendObj.uid)}}/>
                    </div>
                    <div className='col-span-3 cursor-pointer'>
                        <Link href={`/user?uid=${friendObj.uid}`}>
                            <div className='inline-block mr-8'><img src={friendObj.pfp} className= 'w-[38px] h-[50px]'/></div>
                            <div className='inline-block relative top-[-6px]'>
                                <div className="font-bold">{friendObj.lastOnline == true && <CircleIcon className="text-lime-600 mr-1 relative top-[-2px]" fontSize="20px"/>}{friendObj.firstName} {friendObj.lastName}</div>
                                <div className="">@{friendObj.username}</div>
                            </div>
                        </Link>
                    </div>
                </div>
      </div>
    )
}

/**
 * 
 * @prop {JSON} user - User Object 
 * @prop {JSON} requestingUser - User Object of the user requesting to be friends
 * @returns {Object} Friend Request Component
 */
export function FriendRequest({user, requestingUser}) {
    /**
     * Accepts Friend Request
     * @param {JSON} user - User Object
     * @param {JSON} uid - User ID of the user who sent the friend request
     */
    function acceptRequest(user, uid) {
        // Add to user's friends
        set(ref(database, `users/${user.uid}/friends/friends/${uid}`), {
            uid: uid
        })
        set(ref(database, `users/${uid}/friends/friends/${user.uid}`), {
            uid: user.uid
        })
        removeRequest(user, uid)
    }
    /**
     * Removes Friend Request
     * @param {JSON} user - User Object
     * @param {JSON} uid - User ID of the user who sent the friend request
     */
    function removeRequest(user, uid) {
        // Remove from user's friend requests
        set(ref(database, `users/${user.uid}/friends/requests/${uid}`), null)
    }
    return (
        <div className="border-[black] border-1 shadow-lg m-2 rounded-lg">
            <div className='grid grid-cols-4'>
                <div className='place-content-center'>
                    <CheckIcon className='cursor-pointer ml-5' onClick={() => {acceptRequest(user, requestingUser.uid)}}/>
                    <CloseIcon className='cursor-pointer ml-5' onClick={() => {removeRequest(user, requestingUser.uid)}}/>
                </div>
                <div className='col-span-3 cursor-pointer'>
                    <Link href={`/user?uid=${requestingUser.uid}`}>
                        <div className='inline-block mr-5'><img src={requestingUser.pfp} className='w-[50px]'/></div>
                        <div className='inline-block relative top-[-6px]'>
                            <div className="font-bold">{requestingUser.firstName} {requestingUser.lastName}</div>
                            <div className="">@{requestingUser.username}</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
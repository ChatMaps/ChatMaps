import Link from 'next/link'
import ChatIcon from '@mui/icons-material/Chat';

import { database } from "../../../../firebase-config"
import { ref, set, get } from "firebase/database";
import { useEffect, useState } from 'react';

// Icons
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

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
export function Friend({friendObj}) {
    return (
        <div className="border-[black] border-1 shadow-lg m-2 rounded-lg">
                <div className='grid grid-cols-4'>
                    <div className='place-content-center'>
                        <ChatIcon className='cursor-pointer'/>
                    </div>
                    <div className='col-span-3 cursor-pointer'>
                        <Link href={`/user?uid=${friendObj.uid}`}>
                            <div className='inline-block mr-5'><img src={friendObj.pfp} className='w-[50px]'/></div>
                            <div className='inline-block relative top-[-6px]'>
                                <div className="font-bold">{friendObj.firstName} {friendObj.lastName}</div>
                                <div className="">@{friendObj.username}</div>
                            </div>
                        </Link>
                    </div>
                </div>
      </div>
    )
}

export function FriendRequest({user, requestingUser}) {
    function acceptRequest(user, uid) {
        // Add to user's friends
        set(ref(database, `users/${user.uid}/friends/friends/${uid}`), {
            uid: uid
        })
        // Remove from user's friend requests
        set(ref(database, `users/${user.uid}/friends/requests/${uid}`), null)
    }
    return (
        <div className="border-[black] border-1 shadow-lg m-2 rounded-lg">
            <div className='grid grid-cols-4'>
                <div className='place-content-center'>
                    <CheckIcon className='cursor-pointer ml-5' onClick={() => {acceptRequest(user, requestingUser.uid)}}/>
                    <CloseIcon className='cursor-pointer ml-5'/>
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
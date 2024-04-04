// System Imports
import { Popover } from "@headlessui/react";

// Icon Imports
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import CloseIcon from '@mui/icons-material/Close';

// Firebase Imports
import { database } from "../../../../firebase-config";
import { ref, set, remove } from "firebase/database";

/**
 * Notification Object
 * @constructor
 * @prop {user.notification} data - Notification data 
 * @returns {Notification} - Notification Component
 */
function Notification({data}) {
    return (
        <div className="hover:bg-[#C0C0C0] rounded-lg">
            <div className="float-right top-0 cursor-pointer p-2 text-[24px] text-slate-500">
                <div onClick={() => {removeNotification(data.id)}}><CloseIcon/></div>
            </div>
            <div className="p-3 text-left">
                {data.title}<br/>
                {data.byline}<br/>
            </div>
        </div>
    )
}

/**
 * Removes Notification
 * @param {String} ruser - Receiving user UID (User Whose Notifications are being removed)
 * @param {String} dataID - Notification ID
 * @returns {void}
 */
function removeNotification(ruser, dataID) {
    remove(ref(database, `/user/${ruser}/notifications/${dataID}`))
}

/**
* Creates New Notification
* @param {String} title - Title of the notification
* @param {String} byline - Byline of the notification
* @param {String} action - Action to perform (friend request [fr], more to come)
* @param {String} suser - Sending user UID
* @param {String} ruser - Receiving user UID
* @returns {void}
*/
function createNotification(title, byline, action, suser, ruser) {
    var timestamp = new Date().getTime();
    var payload = {
        title: title,
        byline: byline,
        action: action,
        suser: suser,
        ruser: ruser
    };
    set(ref(database, `/user/${ruser}/notifications/${timestamp}-${suser}`), payload);
}

/**
 * Notification Panel
 * @constructor
 * @prop {user} user - User object (from Firebase)
 * @returns {NotificationPanel} - Notification Panel Component
 */
export function NotificationPanel({user}) {
    var notificationsMap = []
    if (user.notification) {
        for (var notificationPackage in user.notification) {
            notificationsMap.push(<Notification data={user.notification[notificationPackage]}/>)
        }
        var isNotifications = true
    } else {
        var isNotifications = false
    }

    return (
        <Popover className="relative">
          <Popover.Button as="div">
            <div className="h-[44px] p-[8px] cursor-pointer bg-cyan-500 text-white font-bold rounded-full shadow-2xl flex items-center">
                <NotificationsIcon />
            </div>
          </Popover.Button>

          <Popover.Panel className="absolute z-10 bg-white mt-[4px] rounded-xl ml-3 shadow-2xl w-64 right-[0px]">
            <div className="grid grid-cols-1">
              {isNotifications && notificationsMap}
              {!isNotifications && 
                <div className="h-[64px] flex flex-col justify-center items-center">
                    <NotificationsPausedIcon/> All caught up!
                </div>
              }
            </div>
          </Popover.Panel>
        </Popover>
    )
}
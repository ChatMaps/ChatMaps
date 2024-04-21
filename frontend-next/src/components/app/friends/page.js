// Dependency Imports
import { Form, useForm } from "react-hook-form";

// Firebase Imports
import { ref, set, onChildAdded, onChildRemoved } from "firebase/database";
import { database } from "../../../../firebase-config";

// Component Imports
import { Chat, SystemMessage } from "../datatypes";

// Icons
import SendIcon from '@mui/icons-material/Send';

// Notification
import { createNotification } from "../notifications/notifications";

import { useEffect, useState } from "react";

/**
 * Chat Room Component
 * @prop {JSON} roomObj - Room Object
 * @prop {JSON} user - User Object
 * @returns {Object} - Chat Room Component
 */
export function DMRoom({ roomObj, user }) {
  const [chatRoomObj, setChatRoomObj] = useState(roomObj);
  const [chats, setChats] = useState(null);
  var { register, control, reset, handleSubmit } = useForm();

  // Listeners for DMs
  useEffect(() => {
    var path = roomObj.UIDs[0] < roomObj.UIDs[1] ? roomObj.UIDs[0] + "-" + roomObj.UIDs[1] : roomObj.UIDs[1] + "-" + roomObj.UIDs[0];
    onChildAdded(ref(database, `/dms/${path}/chats`), (newDM) => {
      if (chatRoomObj) {
        var newDMRoomObj = chatRoomObj
        if (newDMRoomObj) {
          if (!newDMRoomObj.chats) {
            newDMRoomObj.chats = {}
          }
          newDMRoomObj.chats[newDM.key] = newDM.val()
          setChatRoomObj({...newDMRoomObj})
        }
      }

    });
    onChildRemoved(ref(database, `/dms/${path}/chats`), (removed) => {
      if (chatRoomObj) {
        var newDMRoomObj = chatRoomObj
        var deleted = removed.val()
        delete newDMRoomObj.chats[`${deleted.timestamp}-${deleted.user}`]
        setChatRoomObj({...newDMRoomObj})
      }
    });
  }, [])
  
  useEffect(() => {
    // Message updater
    var chatsArr = [];
    var messages = chatRoomObj.chats;
    for (var message in messages) {
      if (messages[message].isSystem) {
        chatsArr.push(
          <SystemMessage
            chatObj={messages[message]}
            key={messages[message].timestamp}
          />
        );
      } else {
        chatsArr.push(
          <Chat
            chatObj={messages[message]}
            user={user}
            path={"/dms/" + chatRoomObj.room}
            key={messages[message].timestamp}
          />
        );
      }
    }
    setChats(chatsArr.reverse())
  }, [chatRoomObj])

  /**
   * Send Message in Chatroom
   * @param {JSON} data - Message data to send (from form)
   * @returns {void}
   */
  function sendMessage(data) {
    // Other UID
    var otherUID = chatRoomObj.initUID == user.uid ? chatRoomObj.targetUID : chatRoomObj.initUID;
    // Send other user notification if not in room
    if (chatRoomObj.users && chatRoomObj.users.online) {
      if (!(otherUID in chatRoomObj.users.online)) {
        createNotification(
          "New Message",
          `${user.username} sent you a message.`,
          "dm",
          user.uid,
          otherUID
        );
      }
    }

    var messageFilterBypass = [undefined, null, "", " ", ' ', '\'']
    reset();
    if (!messageFilterBypass.includes(data.message)) {
      var payload = {
        body: data.message,
        user: user.username,
        uid: user.uid,
        isSystem: false,
        timestamp: new Date().getTime(),
      };
      set(
        ref(
          database,
          `/dms/${chatRoomObj.room}/chats/${new Date().getTime()}-${user.username}`
        ),
        payload
      );
    }
  }

  if (!chats) return <div>No Chats</div>;
  return (
    <div className="m-1 h-[100%] rounded-lg">
      <div className="h-[90%] m-4 overflow-y-auto flex flex-col-reverse">
        {chats}
      </div>
      <div className="m-2 h-[10%] w-[100%] bg-white rounded-lg">
        <Form
          onSubmit={handleSubmit(sendMessage)}
          control={control}
        >
          <div className="width-[100%] grid grid-cols-6 pr-5 pt-1">
            <input type="text" {...register("message")} placeholder="Enter message..." className="col-span-5 border-[0px]" />
            <button className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-5 w-[100%]"><SendIcon/></button>
          </div>
        </Form>
      </div>
    </div>
  );
}

// Dependency Imports
import { Form, useForm } from "react-hook-form";

// Firebase Imports
import { ref, set, onChildAdded, onChildRemoved } from "firebase/database";
import { database } from "../../../../firebase-config";

// Component Imports
import { Chat, SystemMessage } from "../datatypes";

// Icons
import SendIcon from '@mui/icons-material/Send';
import { useState,useEffect } from "react";

/**
 * Chat Room Component
 * @prop {JSON} roomObj - Room Object
 * @prop {JSON} user - User Object
 * @returns {Object} - Chat Room Component
 */
export function ChatRoom({ roomObj, user }) {
  const [chatRoomObj, setChatRoomObj] = useState(roomObj);
  const [chats, setChats] = useState(null);
  var { register, control, reset, handleSubmit } = useForm();
             
  // Listeners for Chats
  useEffect(() => {
    var path = chatRoomObj.path + "/" + chatRoomObj.name + "-" + chatRoomObj.timestamp;
    onChildAdded(ref(database, `/rooms/${path}/chats`), (newChat) => {
      var newChatRoomObj = chatRoomObj
      if (newChatRoomObj) {
        if (!newChatRoomObj.chats) {
          newChatRoomObj.chats = {}
        }
        newChatRoomObj.chats[newChat.key] = newChat.val()
        setChatRoomObj({...newChatRoomObj})
      }

    });
    onChildRemoved(ref(database, `/rooms/${path}/chats`), (removed) => {
      if (chatRoomObj) {
        var newChatRoomObj = chatRoomObj
        var deleted = removed.val()
        delete newChatRoomObj.chats[`${deleted.timestamp}-${deleted.user}`]
        setChatRoomObj({...newChatRoomObj})
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
            path={"/rooms/" + chatRoomObj.path + "/" + chatRoomObj.name + "-" + chatRoomObj.timestamp}
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
    var messageFilterBypass = [undefined, null, '', ' ', '\'', '\"']
    if (!messageFilterBypass.includes(data.message)) {
      reset();
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
          `/rooms/${chatRoomObj.path + "/" + chatRoomObj.name + "-" + chatRoomObj.timestamp}/chats/${new Date().getTime()}-${user.username}`
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

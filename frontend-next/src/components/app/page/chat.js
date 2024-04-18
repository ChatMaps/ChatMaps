// Dependency Imports
import { Form, useForm } from "react-hook-form";

// Firebase Imports
import { ref, set } from "firebase/database";
import { database } from "../../../../firebase-config";

// Component Imports
import { Chat, SystemMessage } from "../datatypes";

// Icons
import SendIcon from '@mui/icons-material/Send';

/**
 * Chat Room Component
 * @prop {JSON} roomObj - Room Object
 * @prop {JSON} user - User Object
 * @returns {Object} - Chat Room Component
 */
export function ChatRoom({ roomObj, user }) {
  var { register, control, reset, handleSubmit } = useForm();

  // Message updater
  var chatsArr = [];
  var messages = roomObj.chats;
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
          path={roomObj.path + "/" + roomObj.name + "-" + roomObj.timestamp}
          key={messages[message].timestamp}
        />
      );
    }
  }
  var chats = chatsArr.reverse();

  /**
   * Send Message in Chatroom
   * @param {JSON} data - Message data to send (from form)
   * @returns {void}
   */
  function sendMessage(data) {
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
        `/rooms/${
          roomObj.path + "/" + roomObj.name + "-" + roomObj.timestamp
        }/chats/${new Date().getTime()}-${user.username}`
      ),
      payload
    );
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

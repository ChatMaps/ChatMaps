import { Chat, SystemMessage } from "../datatypes";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { ref, set } from "firebase/database";
import { database } from "../../../../firebase-config";

// Chatroom Module for Primary Tab
export function MainTabChatRoom({ roomObj, user }) {
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
          key={messages[message].timestamp}
        />
      );
    }
  }
  var chats = chatsArr.reverse();

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
          className="w-[100%] p-[0px]"
        >
          <input
            type="text"
            {...register("message")}
            placeholder="Enter message"
            className="w-[83%] border-[0px] mt-[8px] mb-[8px]"
          />
          <button className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full mr-5 w-[8%]">
            Send
          </button>
        </Form>
      </div>
    </div>
  );
}

function MessagesDisplayBox() {
  return (
    <div className="h-[98%]">
      Messages Stream in Here
    </div>
  )
}

function MessageSendBox() {
  return (
    <div className="bg-white rounded-lg shadow-2xl w-[98%] m-2">
      Message Sender
    </div>
  )
}

function Home() {
  return (
    <div className="">
      <MessagesDisplayBox/>
      <MessageSendBox/>
    </div>
  )
}



export default Home;
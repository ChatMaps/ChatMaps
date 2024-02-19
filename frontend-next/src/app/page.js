export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <h1>Welcome to ChatMaps.</h1>


      <div id="room">
        <label>Room </label>
        <select>
          <option>Room 1</option>
          <option>Room 2</option>
          <option>Room 3</option>
        </select>
        <button>Join Room</button>
      </div>


      <div id="message">
        <label>Enter a message</label>
        <input />
        <button>Send</button>
      </div>


    </main>
  );
}

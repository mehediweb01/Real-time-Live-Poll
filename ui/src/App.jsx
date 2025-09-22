import { useState } from "react";
import Pools from "./components/Pools";

const App = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [pools, setPools] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen text-white bg-gray-700">
      <div className="border border-slate-200 p-8 shadow-md shadow-white rounded-lg">
        {!pools ? (
          <div className="shadow-sm rounded-md flex flex-col gap-4">
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 border border-slate-200 focus:outline-none rounded-md"
            />
            <input
              type="text"
              placeholder="room id"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="px-4 py-2 border border-slate-200 focus:outline-none rounded-md"
            />
            <button
              className="px-4 py-2 border border-slate-200 focus:outline-none rounded-md hover:bg-blue-500 transition-colors duration-200 cursor-pointer"
              onClick={() => setPools(true)}
            >
              join room
            </button>
          </div>
        ) : (
          <Pools username={username} roomId={roomId} />
        )}
      </div>
    </div>
  );
};

export default App;

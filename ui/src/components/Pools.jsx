import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("https://real-time-live-poll.onrender.com");

const Pools = ({ username, roomId }) => {
  const [pool, setPool] = useState([]);

  useEffect(() => {
    socket.emit("join_room", { roomId, username });

    socket.on("pool_data", (data) => {
      setPool([data]);
    });

    socket.on("user_data", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("pool_data");
      socket.off("user_data");
    };
  }, [roomId, username]);

  const handleVote = (optionId) => {
    socket.emit("vote", { roomId, optionId });
  };

  return (
    <div className="w-full">
      <p className="text-black bg-blue-300 px-4 py-2 rounded-md mb-4 ">
        <span className="font-bold">{username}</span> joined room{" "}
        <span className="font-semibold">{roomId}</span>
      </p>
      <div>
        {pool.map((pool, i) => (
          <div key={i}>
            <h1 className="font-bold font-mono text-xl ">{pool.question}</h1>
            {pool.options.map((opt) => (
              <div
                key={opt.id}
                className="border border-slate-200 p-4 shadow-md shadow-white rounded-lg flex justify-between items-center gap-2"
              >
                <div>
                  <p className="text-base font-semibold">{opt.text}</p>
                  <p className="text-sm font-mono text-gray-400">{opt.votes}</p>
                </div>
                <div>
                  <button
                    className="px-4 py-2 border border-slate-200 focus:outline-none rounded-md hover:bg-blue-500 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleVote(opt.id)}
                  >
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pools;

const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const pools = {};
const users = {};

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  socket.on("join_room", ({ roomId, username }) => {
    console.log(username, " joined room", roomId);
    socket.join(roomId);

    if (!users[roomId]) {
      users[roomId] = [];
    }

    users[roomId].push({ id: socket.id, username, voteOptions: null });

    if (!pools[roomId]) {
      pools[roomId] = {
        question: "Which is your favorite frontend framework?",
        options: [
          { id: 1, text: "React", votes: 0 },
          { id: 2, text: "Vue", votes: 0 },
          { id: 3, text: "Angular", votes: 0 },
        ],
      };
    }

    io.to(roomId).emit("pool_data", pools[roomId]);
    io.to(roomId).emit("user_data", users[roomId]);
  });

  socket.on("vote", ({ roomId, optionId }) => {
    if (pools[roomId]) {
      const foundPool = pools[roomId].options.find(
        (opt) => opt.id === optionId
      );
      if (foundPool) {
        foundPool.votes += 1;

        const foundUser = users[roomId].find((u) => u.id === socket.id);
        if (foundUser) {
          foundUser.voteOptions = optionId;
        }
      }

      io.to(roomId).emit("pool_data", pools[roomId]);
      io.to(roomId).emit("user_data", users[roomId]);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);

    for (const roomId in users) {
      users[roomId] = users[roomId].filter((u) => u.id !== socket.id);
      io.to(roomId).emit("user_data", users[roomId]);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const { Server } = require("socket.io");

const io = new Server();

app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    const { roomId, emailId, name, avatar } = data;
    console.log("User", name, "joined room", roomId);
    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId, avatar });
  });

  socket.on("sendMessage", ({ name, avatar, text }) => {
    console.log("sending");
    io.emit("getMessage", {
      name,
      avatar,
      text,
    });

    console.log("emote recieved");
  });
  socket.on("disconnectUser", (data) => {
    const { name } = data;
    console.log("a user disconnected!", name);
  });
});

app.listen(8000, () => console.log(`Example app listening on port 8000!`));
io.listen(8001);

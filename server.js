const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const users = {};
const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF0", "#F0FF33"];
let colorIndex = 0;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const assignedColor = colors[colorIndex % colors.length];
  colorIndex++;

  socket.on("new user", (username) => {
    users[socket.id] = { username: username, color: assignedColor };
    console.log(`User ${username} connected with ID: ${socket.id}, Color: ${assignedColor}`);
    socket.emit("user info", { username: username, color: assignedColor });
  });

  socket.on("chat message", (msgText) => {
    const user = users[socket.id];
    if (user) {
      const message = {
        username: user.username,
        text: msgText,
        color: user.color,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      console.log("Message received:", message);
      io.emit("chat message", message);
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      console.log(`User ${user.username} disconnected: ${socket.id}`);
      delete users[socket.id];
      io.emit("chat message", {
        username: "System",
        text: `${user.username} has left the chat.`,
        color: "#888",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } else {
      console.log("User disconnected:", socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("get-document", (documentId) => {
    // send changes to the socket
    socket.on("send-changes", (code) => {
      socket.broadcast.to(documentId).emit("receive-changes", code);
      console.log(code)
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

setInterval(() => {
  io.emit("time", new Date());
}, 1000);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

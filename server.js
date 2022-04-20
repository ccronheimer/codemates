require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const http = require("http");
const server = http.createServer(app);
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.client.conn.server.clientsCount + " users connected");

  socket.on("get-document", (documentId) => {
    // join room
    socket.join(documentId);

    socket.broadcast
      .to(documentId)
      .emit("count", socket.client.conn.server.clientsCount);
    // send changes to the other sockets connected
    socket.on("send-changes", (code) => {
      socket.broadcast.to(documentId).emit("receive-changes", code);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

setInterval(() => {
  io.emit("time", new Date());
}, 1000);

// get a code document
app.get("/api/v1/code/:id", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM code WHERE id = $1", [
      req.params.id,
    ]);

    res.status(200).json({
      status: "success",
      data: {
        code: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Create a new code document
app.post("/api/v1/code", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO code (id, code) values ($1, $2) returning *",
      [req.body.id, req.body.code]
    );
    res.status(201).json({
      status: "succes",
      data: {
        code: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/v1/code/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE code SET code = $1 where id = $2 returning *",
      [req.body.code, req.params.id]
    );
    res.status(200).json({
      status: "success",
      data: {
        code: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

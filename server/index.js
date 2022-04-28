require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const http = require("http");
const server = http.createServer(app);
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

let numUsers = 0;

// Postgres client setup
const { Pool } = require("pg");
const pgClient = new Pool({
  // user: process.env.PGUSER,
  // host: process.env.PGHOST,
  // database: process.env.PGDATABASE,
  // password: process.env.PGPASSWORD,
  // port: process.env.PGPORT
  user: process.env.RDS_USERNAME,
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB_NAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
});

//CREATE TABLE code (id VARCHAR(50) NOT NULL, code TEXT, PRIMARY KEY (id));

pgClient.on("connect", (client) => {
  client
    .query(
      "CREATE TABLE IF NOT EXISTS code (id VARCHAR(50) NOT NULL, code TEXT, PRIMARY KEY (id))"
    )
    .catch((err) => console.log("PG ERROR", err));
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://client",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.on("get-document", async (documentId) => {
    // join room
    socket.join(documentId);
    numUsers++;

    // number of users in room 
    io.in(documentId).emit("clients", io.sockets.adapter.rooms.get(documentId).size);
   
    // send changes to the other sockets connected
    socket.on("CODE_CHANGED", (code) => {
      //socket.broadcast.to(documentId).emit("receive-changes", code);
      socket.to(documentId).emit("receive-changes", code);
    });

    // change syntax of sockets
    socket.on("change-syntax", (syntax) => {
      socket.broadcast.to(documentId).emit("syntax-change", syntax);
    });

    // when user leaves our room
    socket.on("disconnect", () => {
      console.log("user disconnected");
      numUsers--;
      io.to(documentId).emit("clients", numUsers);
    });
  });
});

// Express route definitions
app.get("/", (req, res) => {
  res.send("Hi");
});

// get a code document
app.get("/v1/code/:id", async (req, res) => {
  try {
    const results = await pgClient.query("SELECT * FROM code WHERE id = $1", [
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
app.post("/v1/code", async (req, res) => {
  try {
    const results = await pgClient.query(
      "INSERT INTO code (id, code) values ($1, $2) returning *",
      [req.body.id, req.body.code]
    );
    res.status(201).json({
      status: "success",
      data: {
        code: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/v1/code/:id", async (req, res) => {
  try {
    const results = await pgClient.query(
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

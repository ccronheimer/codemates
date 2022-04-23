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
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

//CREATE TABLE code (id VARCHAR(50) NOT NULL, code TEXT, PRIMARY KEY (id));

pgClient.on("connect", client => {
  client
    .query("CREATE TABLE IF NOT EXISTS code (id VARCHAR(50) NOT NULL, code TEXT, PRIMARY KEY (id))")
    .catch(err => console.log("PG ERROR", err));
});


const io = require("socket.io")(server, {
  cors: {
    origin: "http://client",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  socket.on("get-document", (documentId) => {
    // join room
    socket.join(documentId);
    numUsers++;
    io.to(documentId).emit("clients", numUsers);

    // send changes to the other sockets connected
    socket.on("send-changes", (code) => {
      socket.broadcast.to(documentId).emit("receive-changes", code);
    });

    // change syntax of sockets
    socket.on("send-syntax", (syntax) => {
      socket.broadcast.to(documentId).emit("receive-syntax", syntax);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      numUsers--;
      io.to(documentId).emit("clients", numUsers);
    });
  });
});

setInterval(() => {
  io.emit("time", new Date());
}, 1000);

//Express route definitions
app.get("/", (req, res) => {
  res.send("Hi");
});


// app.get("/values/all", async(req, res) => {
//   const values = await pgClient.query("SELECT * FROM values");
//   console.log(values);
//   res.send(values);

// })

// app.put("/values", async(req, res) => {
//   if(!req.body.value) res.send({ working: false});
//   pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value])
//   console.log(req.body.value);

//   res.send({working: true});

// })


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

const app = require("express")();
const http = require("http");
const Config = require("./config");
const handler = require("./handler");
const PostgresSQL = require("./postgres");
const log = console.log;
const server = http.createServer(app);

const { Server } = require("socket.io");
const { conn } = require("./socket");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
});

const expressServer = server.listen(Config.PORT, async () => {
  log(`Server starting on port - http://localhost:${Config.PORT}/`);

  // Connecting to PostgresSQL
  const db = await PostgresSQL.initialize();
  log(`${Config.DB_DATABASE} DataBase Connected Successfully.`);
  handler(app, db, io);
  io.on("connection", (socket) => {
    conn(socket);
  });
});

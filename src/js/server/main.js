const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket, next) => {
  const { username, x, y } = socket.handshake.auth;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.x = x;
  socket.y = y;
  
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      x: socket.x,
      y: socket.y
    });
  }

  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
    x: socket.x,
    y: socket.y
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3500;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
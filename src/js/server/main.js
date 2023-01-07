import Http from "http"
import { Server } from "socket.io";
import { randomCoords } from '../helpers.js';
const httpServer = Http.createServer();

const io = new Server(httpServer, {
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
  const users = [];
    
  // fetch existing users
  for (let [id, s] of io.of("/").sockets) {
    if (socket.id !== id) {
      users.push({
        userID: id,
        username: s.username,
        x: s.x,
        y: s.y
      });
    }
  }

  socket.emit("users", users);

  socket.on('move', (move) => {
    socket.broadcast.emit('usermove', {
      userID: socket.id,
      x: socket.x,
      y: socket.y,
      move,
    })
  })

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
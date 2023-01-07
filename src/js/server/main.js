import Http from "http"
import { Server } from "socket.io";
import { randomCoords } from '../helpers.js';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

import env from '../../../env.json' assert { type: 'json' };

const app = express();

if (env.PROD) {
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = path.dirname(__filename);
  use.app(express.static('dist'));
}

const server = Http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.WS,
  },
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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

const PORT = env.PORT || 8000;
server.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
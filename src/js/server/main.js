import Http from "http"
import { Server } from "socket.io";
import { randomCoords } from '../helpers.js';
import express from "express";
import path from 'path';
import apiRouter from './routes/api'

import env from '../../../env.json' assert { type: 'json' };

const app = express();

const coins = [];

if (env.PROD) {
  app.use(express.static('dist'));

  app.get('/', (req, res) => {
    res.sendFile(path.join('/var/www/nodejs/dist/index.html'));
  });
  
}

app.use('/api', apiRouter);

const server = Http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
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

  // setInterval(() => {
  //   if (coins.length < 50) {
  //     const newCoin = randomCoords()
  //     if (!coins.some((coin) => coin.x == newCoin.x && coin.y === newCoin.y)) {
  //       coins.push(newCoin)
  //       socket.volatile.emit('coin add', newCoin);
  //     }
  //   }
  // }, 2000)

  // socket.emit('coin add', coins);

  socket.emit("users", users);

  socket.on('keypress', ({ key, x, y }) => {
    socket.volatile.broadcast.emit('usermove', {
      userID: socket.id,
      x,
      y,
      key,
    })
  })

  socket.on('keyup', ({ key, x, y }) => {
    socket.volatile.broadcast.emit('userkeyup', {
      userID: socket.id,
      x,
      y,
      key,
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
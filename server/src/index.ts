import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { roomHandler } from './room';

const port = 8080;
const app = express();

// Middleware to enable CORS
app.use(cors());

// Create an HTTP server and attach Socket.IO to it
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  console.log("user is connected");
 roomHandler(socket)

  socket.on('disconnect', () => {
    console.log("user is disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

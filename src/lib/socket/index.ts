import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import settings from '@/settings';

const app = express();
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true
  }
});

httpServer.listen(settings.socketPort);

console.log(`Server started and listening on ${settings.socketPort}`);

export default io;
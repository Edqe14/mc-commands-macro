import { Server } from 'socket.io';
import settings from '@/settings';

const io = new Server({
  cors: {
    origin: '*',
    credentials: true
  }
});

io.listen(settings.socketPort);

console.log(`Socket listening on ${settings.socketPort}`);

export default io;
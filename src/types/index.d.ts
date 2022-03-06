import Enmap from 'enmap';
import { Bot } from 'mineflayer';
import { Socket } from 'socket.io';

export interface SocketEventArguments {
  socket: Socket;
  store: Enmap;
  connections: Enmap;
  bot: Bot;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SocketEventHandler = (args: SocketEventArguments) => any;
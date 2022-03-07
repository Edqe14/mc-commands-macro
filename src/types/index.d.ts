import Enmap from 'enmap';
import { Bot } from 'mineflayer';
import { Socket } from 'socket.io';

export interface Command {
  commands: string[];
  name: string;
  id: string;
  color: string;
}

export interface SocketEventArguments {
  socket: Socket;
  store: Enmap<string, Command>;
  connections: Enmap;
  bot: Bot;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SocketEventHandler = (args: SocketEventArguments) => any;
export type ValueOf<T> = T[keyof T];
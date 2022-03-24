import { Bot } from 'mineflayer';
import { Socket } from 'socket.io';
import { readdirSync } from 'fs';
import path from 'path';
import { store, connections } from '@/lib/store';
import { SocketEventHandler } from '@/types';
import { getInstance } from '../bot';

const ext = path.extname(__filename);
const dir = path.join(__dirname, 'events');
const events = readdirSync(dir, 'utf8')
  .filter((v) => path.extname(v) === ext)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .map<[string, Promise<any>]>((file) => [file, import(path.join(dir, file))])
  .reduce((acc, [name, promise]) => {
    acc[path.basename(name, ext)] = promise;

    return acc;
  }, {} as Record<string, Promise<unknown>>);

export function registerEmitter(socket: Socket, bot: Bot) {
  socket.emit('commands.set', Array.from(store.values()));

  const chatHandler = (name: string, message: string) => {
    socket.emit('message', { name, message });
  };

  bot.on('chat', chatHandler);
  socket.once('disconnect', () => bot.removeListener('chat', chatHandler));
}

export default async function listenEvents(socket: Socket, bot: Bot) {
  registerEmitter(socket, bot);

  const functionsName = Object.keys(events);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const functions = (await Promise.all<Promise<any>>(Object.values(events)))
    .filter((exp) => typeof exp?.default === 'function')
    .map<[string, SocketEventHandler]>((v, i) => [functionsName[i], v.default]);

  functions.forEach(([event, handler]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on(event, (data: any) => {
      const conn = connections.get(socket.id);
      if (!conn.authed) {
        socket.emit('auth.error', {
          message: 'Illegal request sent'
        });

        return socket.disconnect(true);
      }

      if (conn.token !== data.token) return socket.emit('auth.error', {
        message: 'Invalid token sent'
      });

      const instance = getInstance();
      if (!instance) return socket.emit('error', { message: 'Bot not found' });

      return handler({ socket, store, connections, bot: instance, data });
    });
  });
}

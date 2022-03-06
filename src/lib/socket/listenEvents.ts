import { Bot } from 'mineflayer';
import { Socket } from 'socket.io';
import { readdirSync } from 'fs';
import path from 'path';
import { store, connections } from '@/lib/store';
import { SocketEventHandler } from '@/types';

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

export default async function listenEvents(socket: Socket, bot: Bot) {
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

      if (conn.token !== data.token) return socket.emit('token.error', {
        message: 'Invalid token sent'
      });

      return handler({ socket, store, connections, bot, data });
    });
  });
}

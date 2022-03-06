import { nanoid } from 'nanoid';
import settings from '@/settings';
import io from '@/lib/socket';
import { connections } from '@/lib/store';
import listenEvents from '@/lib/socket/listenEvents';
import { createInstance } from '@/lib/bot';

const bot = createInstance();

io.on('connection', async (socket) => {
  connections.set(socket.id, {
    authed: false,
    token: null,
    tries: 0
  });

  const timeout = settings.authTimeout > 0
    ? setTimeout(() => {
      console.log(`[${socket.id}] Timeout`);

      connections.delete(socket.id);
      socket.emit('auth.timeout', { message: 'Authentication timeout' });
      socket.disconnect(true);
    }, settings.authTimeout)
    : null;

  socket.on('auth', async ({ token }) => {
    if (token !== settings.token) {
      const tries = connections.get(socket.id, 'tries');
      if (tries > settings.maxTries) {
        socket.emit('auth.error', { message: 'Max tries exceeded' });

        return socket.disconnect(true);
      }

      connections.set(socket.id, tries + 1, 'tries');

      return socket.emit('auth.error', {
        message: 'Invalid token'
      });
    }

    const connToken = nanoid();
    connections.set(socket.id, true, 'authed');
    connections.set(socket.id, connToken, 'token');

    if (timeout !== null) clearTimeout(timeout);
    listenEvents(socket, bot);

    return socket.emit('auth.success', {
      token: connToken
    });
  });

  socket.on('disconnect', () => connections.delete(socket.id));
});
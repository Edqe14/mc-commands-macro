import { SocketEventHandler } from '@/types';

const handler: SocketEventHandler = ({ socket, store, data: { id } }) => {
  if (!id || typeof id !== 'string') return socket.emit('error', { message: 'Invalid ID' });
  if (!store.has(id)) return socket.emit('error', { message: 'Unknown macro' });

  const name = store.get(id, 'name');

  console.log(`[${socket.id}] Deleting "${name}"`);

  try {
    store.delete(id);

    return socket.emit('commands.remove', { message: `Deleted ${name}`, id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return socket.emit('error', e?.message);
  }
};

export default handler;

import { nanoid } from 'nanoid';
import Color from 'color';
import { SocketEventHandler } from '@/types';

const handler: SocketEventHandler = ({ socket, store, data: { id, color, name, commands } }) => {
  if (!name || typeof name !== 'string') return socket.emit('error', { message: 'Invalid name' });
  if (!commands || !Array.isArray(commands)) return socket.emit('error', { message: 'Invalid commands' });

  const cid = id || nanoid();
  const hex = Color(color).hex();

  const val = {
    id: cid,
    name: name?.trim(),
    color: hex,
    commands: commands
      .filter(Boolean)
      .filter((c) => typeof c === 'string')
  };

  store.set(cid, val);

  return socket.emit(id ? 'commands.edit' : 'commands.append', val);
};

export default handler;

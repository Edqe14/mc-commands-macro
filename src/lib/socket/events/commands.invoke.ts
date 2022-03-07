import { SocketEventHandler } from '@/types';

const handler: SocketEventHandler = ({ socket, bot, store, data: { id } }) => {
  if (!id || typeof id !== 'string') return socket.emit('error', { message: 'Invalid ID' });

  const command = store.get(id);
  if (!command) return socket.emit('error', { message: 'Unknown macro' });

  console.log(`[${socket.id}] Executing "${command.name}"`);

  try {
    command.commands.forEach((cmd) => bot.chat(cmd));
    return socket.emit('commands.success', { message: `Ranned ${command.name}`, id: command.id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return socket.emit('error', e?.message);
  }
};

export default handler;

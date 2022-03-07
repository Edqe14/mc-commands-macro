import { SocketEventHandler } from '@/types';

const handler: SocketEventHandler = ({ bot, data: { message } }) => {
  bot.chat(message);
};

export default handler;

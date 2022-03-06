import { SocketEventHandler } from '@/types';

const handler: SocketEventHandler = ({ bot, data: { text } }) => {
  bot.chat(text);
};

export default handler;

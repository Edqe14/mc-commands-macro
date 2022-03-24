import { Bot, BotOptions } from 'mineflayer';
import { config } from 'dotenv';

config();

interface ISettings extends BotOptions {
  requireAuth: boolean;
  token: string;
  socketPort: number;
  authTimeout: number;
  autoReconnect: boolean;
  maxTries: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoExec?: (bot: Bot) => any;
}

const settings: ISettings = {
  autoReconnect: true,
  host: process.env.MC_HOST ?? 'localhost',
  port: process.env.MC_PORT as unknown as number ?? 25565,
  username: 'BOT_Controller',
  requireAuth: true,
  token: process.env.TOKEN as string,
  socketPort: (process.env.PORT as unknown as number) ?? 5000,
  authTimeout: 10_000,
  maxTries: 5,
  colorsEnabled: false,
  autoExec(bot) {
    bot.chatAddPattern(/「.*?」 (.*?)「.*?」 » (.*)/, 'chat');

    bot.on('chat', async (name: string, message: string) => {
      if (name !== 'command') return;

      if (message.includes('register')) bot.chat(`/register ${process.env.BOT_PASS} ${process.env.BOT_PASS}`);
      if (message.includes('login')) bot.chat(`/login ${process.env.BOT_PASS}`);
    });

    bot.on('end', () => console.log('end'));
  }
};

export default settings;
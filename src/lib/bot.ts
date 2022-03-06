import mineflayer, { Bot } from 'mineflayer';
import settings from '@/settings';

let instance: Bot | null = null;

export function createInstance() {
  instance = mineflayer.createBot(settings);

  if (settings.autoExec) settings.autoExec(instance);
  if (settings.autoReconnect) instance.once('end', () => { instance = createInstance(); });

  return instance;
}

export function getInstance() {
  return instance;
}
/* eslint-disable no-param-reassign */

import mineflayer, { Bot } from 'mineflayer';
import { nanoid } from 'nanoid';
import settings from '@/settings';
import { listeners } from '@/lib/store';

let instance: Bot | null = null;

function interceptEvent(bot: Bot) {
  const all = Array.from(listeners.values());
  all.forEach(([name, handler, type]) => bot[type](name, handler));

  const originalOn = bot.on.bind(bot);
  bot.on = (event, listener) => {
    const id = nanoid();
    listeners.set(id, [event, listener, 'on']);

    originalOn(event, listener);
    return bot;
  };

  const originalOnce = bot.once.bind(bot);
  bot.once = (event, listener) => {
    const id = nanoid();
    const handlerId = nanoid();

    const handler = () => {
      listeners.delete(id);
      listeners.delete(handlerId);
    };

    listeners.set(id, [event, listener, 'once']);
    listeners.set(handlerId, [event, handler, 'once']);

    originalOnce(event, listener);
    originalOnce(event, handler);
    return bot;
  };

  const originalRemoveListener = bot.removeListener.bind(bot);
  bot.removeListener = (event, listener) => {
    const id = listeners.findKey(([name, fn]) => event === name && fn === listener);
    if (id) listeners.delete(id);

    originalRemoveListener(event, listener);
    return bot;
  };

  return bot;
}

let restartCount = 0;

export function createInstance() {
  instance = mineflayer.createBot(settings);

  // BUGGY
  if (settings.autoReconnect) instance.once('end', () => {
    if (restartCount > settings.maxTries) {
      console.warn('Max tries exceeded, exiting...');

      return process.exit(1);
    }

    instance = createInstance();

    restartCount += 1;
  });

  instance.once('spawn', () => {
    if (settings.autoExec) settings.autoExec(instance as Bot);

    restartCount = 0;

    console.log('MC Spawned');
  });

  interceptEvent(instance);

  return instance;
}

export function getInstance() {
  return instance;
}
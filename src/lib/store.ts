import Enmap from 'enmap';
import { BotEvents } from 'mineflayer';
import { Command, ValueOf } from '@/types';

export const store = new Enmap<string, Command>({ name: 'store' });
export const connections = new Enmap();
// eslint-disable-next-line @typescript-eslint/ban-types
export const listeners = new Enmap<string, [keyof BotEvents, ValueOf<BotEvents>, 'on' | 'once']>();
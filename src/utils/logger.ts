import {TweakPane} from '../settings/TweakPane.ts';

const log = (level: 'log' | 'error' | 'warn', args: any[]) => {
  TweakPane.log(args.map(arg => arg.toString()).join(', '));
  console[level](...args);
}

export const logger = {
  log: (message: string, ...args  : any[]) => {
    log('log', [message, ...args]);
  },
  error: (message: string, ...args  : any[]) => {
    log('error', [message, ...args]);
  },
  warn: (message: string, ...args : any[]) => {
    log('warn', [message, ...args]);
  },
}

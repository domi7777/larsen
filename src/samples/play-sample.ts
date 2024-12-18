import {playHiHat} from './drums/hihat.ts';
import {playKick} from './drums/kick.ts';
import {playSnare} from './drums/snare.ts';
import {playCrashCymbal} from './drums/crash.ts';
import {playOpenHiHat} from './drums/hihat-open.ts';
import {playRide} from './drums/ride.ts';
import {playTom1Low} from './drums/tom-low.ts';
import {playTom2High} from './drums/tom-high.ts';
import {resetAudioContext} from './sample-utils.ts';
import {logger} from '../utils/logger.ts';

const sampleToAudioFn: Record<Sample, (volume: number) => void> = {
  hihat: playHiHat,
  kick: playKick,
  snare: playSnare,
  crash: playCrashCymbal,
  'hihat-open': playOpenHiHat,
  ride: playRide,
  'tom-low': playTom1Low,
  'tom-high': playTom2High,
}

export const playSample = (sample: Sample, volume: number) => {
  try {
    sampleToAudioFn[sample](volume);
  } catch (e) {
    logger.error(`Error playing ${sample}`, e);
    resetAudioContext();
    sampleToAudioFn[sample](volume);
  }
}

export type Sample = 'hihat' | 'hihat-open' | 'ride' | 'crash'
  | 'snare' | 'kick' | 'tom-low' | 'tom-high';

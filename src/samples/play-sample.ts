import {playHiHat} from './drums/hihat.ts';
import {playKick} from './drums/kick.ts';
import {playSnare} from './drums/snare.ts';
import {playCrashCymbal} from './drums/crash.ts';
import {playOpenHiHat} from './drums/hihat-open.ts';
import {playRide} from './drums/ride.ts';
import {resetAudioContext} from './sample-utils.ts';
import {logger} from '../utils/logger.ts';
import {playHighTom, playLowTom, playMidTom} from './drums/toms.ts';

const sampleToAudioFn: Record<Sample, (volume: number) => void> = {
  hihat: playHiHat,
  kick: playKick,
  snare: playSnare,
  crash: playCrashCymbal,
  'hihat-open': playOpenHiHat,
  ride: playRide,
  'tom-low': playLowTom,
  'tom-high': playHighTom,
  'tom-mid': playMidTom,
}

export const playSample = (sample: Sample, volume: number) => {
  if (volume === 0) {
    return;
  }
  try {
    sampleToAudioFn[sample](volume);
  } catch (e) {
    logger.error(`Error playing ${sample}`, e);
    resetAudioContext();
    sampleToAudioFn[sample](volume);
  }
}

export type Sample = 'hihat' | 'hihat-open' | 'ride' | 'crash'
  | 'snare' | 'kick' | 'tom-low' | 'tom-high' | 'tom-mid';

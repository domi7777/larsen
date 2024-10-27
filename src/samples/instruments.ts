import {playHiHat} from './drums/hihat.ts';
import {playKick} from './drums/kick.ts';
import {playSnare} from './drums/snare.ts';
import {playCrashCymbal} from './drums/crash.ts';
import {playOpenHiHat} from './drums/hihat-open.ts';
import {playRide} from './drums/ride.ts';
import {playTom1Low} from './drums/tom-low.ts';
import {playTom2High} from './drums/tom-high.ts';
import {resetAudioContext} from './sample-utils.ts';

export const instrumentToSample: Record<Instrument, () => void> = {
  hihat: playHiHat,
  kick: playKick,
  snare: playSnare,
  crash: playCrashCymbal,
  'hihat-open': playOpenHiHat,
  ride: playRide,
  'tom-low': playTom1Low,
  'tom-high': playTom2High,
}

export const playInstrument = (instrument: Instrument) => {
  try {
    instrumentToSample[instrument]();
  } catch(e) {
    console.error(`Error playing ${instrument}`, e);
    resetAudioContext();
    instrumentToSample[instrument]();
  }
}

export type Instrument = 'hihat' | 'hihat-open' | 'ride' | 'crash'
    | 'snare' | 'kick' | 'tom-low' | 'tom-high';

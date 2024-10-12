import {playHiHat} from './samples/hihat.ts';
import {playKick} from './samples/kick.ts';
import {playSnare} from './samples/snare.ts';
import {playCrashCymbal} from './samples/crash.ts';
import {playOpenHiHat} from './samples/hihat-open.ts';
import {playRide} from './samples/ride.ts';
import {playTom1Low} from './samples/tom-low.ts';
import {playTom2High} from './samples/tom-high.ts';
import {resetAudioContext} from './samples/sample-utils.ts';
import {isRecording, loop, startRecordingTime} from './loops.ts';

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

  if (isRecording) {
    const time = Date.now() - startRecordingTime;
    loop.push({
      instrument,
      time
    });
    console.log(`Recording ${instrument} at time ${time}ms`);
  }
}

export type Instrument = 'hihat' | 'hihat-open' | 'ride' | 'crash'
    | 'snare' | 'kick' | 'tom-low' | 'tom-high';

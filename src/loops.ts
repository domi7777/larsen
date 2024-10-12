import {Instrument, playInstrument} from './instruments.ts';

export let isRecording = false;
export let startRecordingTime = 0;

type LoopEntry = {
    instrument: Instrument | null,
    time: number,
}
export let loop: LoopEntry[] = [];
let currentLoopIndex = 0;
let loopTimeout: number | null = null;

export function startRecording() {
  isRecording = true;
  startRecordingTime = Date.now();
  loop = [];
  console.log('Recording started');
}

export function stopRecording() {
  isRecording = false;
  loop.push({
    instrument: null,
    time: Date.now() - startRecordingTime
  });
  console.log('Recording stopped');
}

export function startPlaying() {
  const playLoop = () => {
    if (currentLoopIndex >= loop.length) {
      currentLoopIndex = 0;
    }
    const {instrument, time} = loop[currentLoopIndex];
    const previousTime = currentLoopIndex === 0 ? 0 : loop[currentLoopIndex - 1].time;
    loopTimeout = setTimeout(() => {
      console.log(`Playing ${instrument} after ${time}ms`);
      instrument && playInstrument(instrument);
      currentLoopIndex++;
      playLoop();
    }, time - previousTime);
  }
  console.log('Loop play starting');
  playLoop();
}

export function stopPlaying() {
  loopTimeout && clearTimeout(loopTimeout);
  console.log('Loop stopped');
}

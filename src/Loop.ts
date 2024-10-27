import {playSample, Sample} from './samples/instruments.ts';

type LoopEntry = {
  instrument: Sample | null,
  time: number,
}

type LoopState = 'readyToRecord' | 'recording' | 'readyToPlay' | 'playing';

export class Loop {
  constructor(private trackIndex: number) {
  }

  private state : LoopState = 'readyToRecord';
  private loop: LoopEntry[] = [];
  private startRecordingTime = 0;
  private currentLoopIndex = 0;
  private loopTimeout: number | null = null;

  handleClick() {
    this.nextState();
    switch (this.state) {
    case 'recording':
      this.startRecording();
      break;
    case 'playing':
      this.startPlaying();
      break;
    case 'readyToPlay':
      this.stopPlaying();
      break;
    }
  }

  addInstrument(instrument: Sample) {
    if (this.isRecording()) {
      this.loop.push({
        instrument,
        time: Date.now() - this.startRecordingTime
      });
      this.log(`Recording ${instrument} at time ${Date.now() - this.startRecordingTime}ms`);
    }
  }

  isPlaying() {
    return this.state === 'playing';
  }

  isReadyToPlay() {
    return this.state === 'readyToPlay';
  }

  isRecording() {
    return this.state === 'recording';
  }

  isReadyToRecord() {
    return this.state === 'readyToRecord';
  }

  private nextState() {
    switch (this.state) {
    case 'readyToRecord':
      this.state = 'recording';
      break;
    case 'recording':
      this.state = 'playing';
      break;
    case 'readyToPlay':
      this.state = 'playing';
      break;
    case 'playing':
      this.state = 'readyToPlay';
      break;
    }
  }

  private startRecording() {
    this.startRecordingTime = Date.now();
    this.loop = [];
    this.log('Recording started');
  }

  private stopRecording() {
    this.loop.push({
      instrument: null,
      time: Date.now() - this.startRecordingTime
    });
    this.log('Recording stopped');
  }

  private startPlaying() {
    if (this.isRecording()) {
      this.stopRecording();
    }
    const playLoop = () => {
      if (this.currentLoopIndex >= this.loop.length) {
        this.currentLoopIndex = 0;
      }
      const {instrument, time} = this.loop[this.currentLoopIndex];
      const previousTime = this.currentLoopIndex === 0 ? 0 : this.loop[this.currentLoopIndex - 1].time;
      this.loopTimeout = setTimeout(() => {
        this.log(`Playing ${instrument} after ${time}ms`);
        instrument && playSample(instrument);
        this.currentLoopIndex++;
        playLoop();
      }, time - previousTime);
    }
    this.log('Loop play starting');
    playLoop();
  }

  private stopPlaying() {
    this.loopTimeout && clearTimeout(this.loopTimeout);
    this.log('Loop stopped');
  }

  private log(msg: string, args?: unknown[]) {
    console.log(`Loop ${(this.trackIndex + 1)}: ${msg}`, args);
  }

}

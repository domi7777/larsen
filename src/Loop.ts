import Phaser from 'phaser';

type LoopEvent = {
  callback: Function | 'endOfLoop',
  time: number,
}

type LoopState = 'readyToRecord' | 'recording' | 'readyToPlay' | 'playing';

export class Loop {
  constructor(private trackIndex: number) {
    this.log('Loop created');
  }

  private state: LoopState = 'readyToRecord';
  private events: LoopEvent[] = [];
  private eventEmitter = new Phaser.Events.EventEmitter();
  private startRecordingTime?: number;
  private startPlayingTime = 0;
  private currentLoopIndex = 0;
  private loopTimeout: number | null = null;
  private static masterLoop: Loop | null = null;

  getStartPlayingTime() {
    return this.startPlayingTime;
  }

  getLoopLength() {
    return this.events.find(({callback}) => callback === 'endOfLoop')?.time;
  }

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

  addLoopEvent(callback: Function) {
    if (this.isRecording()) {
      if (!this.startRecordingTime) {
        this.startRecordingTime = Loop.masterLoop!.getStartPlayingTime();
      }
      const time = Date.now() - this.startRecordingTime;
      this.events.push({
        callback,
        time
      });
      this.log(`Recording ${callback} at time ${time}ms`);
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

  destroy() {
    this.eventEmitter.removeAllListeners();
    if (this.isPlaying()) {
      this.stopPlaying();
    }
    this.events = [];
    if (this.isMasterLoop()) {
      Loop.masterLoop = null;
    }
    this.log('Loop destroyed');
  }

  addEventListener(event: 'endOfLoop', callback: Function) {
    this.eventEmitter.once(event, callback);
  }

  private nextState() {
    switch (this.state) {
    case 'readyToRecord':
      this.state = 'recording';
      break;
    case 'recording':
      this.state = this.stopRecording();
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
    this.events = [];
    this.log('Recording started');
    if (!Loop.masterLoop) {
      Loop.masterLoop = this;
      this.startRecordingTime = Date.now();
    } else {
      // master loop starts at first event
    }
  }

  private stopRecording(): LoopState {
    if (this.events.length === 0) {
      this.log('No events recorded');
      return 'readyToRecord';
    }
    if (!this.startRecordingTime) {
      throw new Error('startRecordingTime is not set');
    }
    const endTime = Date.now() - this.startRecordingTime;

    if (this.isMasterLoop()) {
      this.events.push({
        callback: 'endOfLoop',
        time: endTime
      });
      const firstEventTime = this.events[0].time;
      this.events = this.events.map(({time, callback}) => ({
        time: time - firstEventTime,
        callback
      }));
    } else {
      console.log(this.events);
      const masterLoopLength = Loop.masterLoop?.getLoopLength();
      if (!masterLoopLength){
        throw new Error('masterLoopLength is not set');
      }
      // check how many times the master loop fits in this loop so that it is always in sync
      const loopCount = Math.floor(endTime / masterLoopLength);
      const maxTime = loopCount * masterLoopLength;
      this.events = this.events.filter(({time}) => time <= maxTime);
      this.events.push({
        callback: 'endOfLoop',
        time: maxTime
      });
    }

    this.log(`Recording stopped at ${endTime} with ${this.events.length} events, start playing`);
    return 'playing';
  }

  private startPlaying() {
    const playLoop = () => {
      if (this.currentLoopIndex >= this.events.length) {
        this.currentLoopIndex = 0;
      }
      if (this.currentLoopIndex === 0) {
        this.log('Loop play (re)-started', '#0F0');
        this.startPlayingTime = Date.now();
      }
      const {callback, time} = this.events[this.currentLoopIndex];
      const previousTime = this.currentLoopIndex === 0 ? 0 : this.events[this.currentLoopIndex - 1].time;
      this.loopTimeout = setTimeout(() => {
        this.log(`Playing event ${callback} after ${time}ms`);
        if (callback !== 'endOfLoop') {
          callback();
        } else {
          this.eventEmitter.emit('endOfLoop');
        }
        this.currentLoopIndex++;
        playLoop();
      }, time - previousTime);
    }
    this.log('Loop play starting');
    if (!this.isMasterLoop() && Loop.masterLoop?.isPlaying()) {
      // wait the end of the master loop to start in sync
      Loop.masterLoop.addEventListener('endOfLoop', () => {
        playLoop();
      });
    } else {
      playLoop();
    }
  }

  private stopPlaying() {
    this.loopTimeout && clearTimeout(this.loopTimeout);
    this.currentLoopIndex = 0;
    this.log('Loop stopped');
  }

  private isMasterLoop() {
    return this === Loop.masterLoop;
  }

  private log(msg: string, color: string = '#FFF') {
    const message = `%cLoop ${(this.trackIndex + 1)}: ${msg}`;
    console.log(message, `color: ${color}`);
  }

}

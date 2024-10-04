
import Phaser from 'phaser';
import {playHiHat} from '../samples/hihat.ts';
import {playSnare} from '../samples/snare.ts';
import {playKick} from '../samples/kick.ts';
import {playCrashCymbal} from '../samples/crash.ts';
import {HexaColor, hexToColor} from '../colors.ts';

// loop
let isRecording = false;
let startRecordingTime = 0;

type LoopEntry = {
  instrument: Instrument,
  time: number,
}
let loop: LoopEntry[] = [];
let currentLoopIndex = 0;
let loopTimeout: number | null = null;

function startRecording() {
  isRecording = true;
  startRecordingTime = Date.now();
  loop = [];
  console.log('Recording started');
}

function stopRecording() {
  isRecording = false;
  console.log('Recording stopped');
}

function startPlaying() {
  const playLoop = () => {
    if (currentLoopIndex >= loop.length) {
      currentLoopIndex = 0;
    }
    const {instrument, time} = loop[currentLoopIndex];
    const previousTime = currentLoopIndex === 0 ? 0 : loop[currentLoopIndex - 1].time;
    loopTimeout = setTimeout(() => {
      console.log(`Playing ${instrument} after ${time}ms`);
      playInstrument(instrument);
      currentLoopIndex++;
      playLoop();
    }, time - previousTime);
  }
  console.log('Loop play starting');
  playLoop();
}

function stopPlaying() {
  loopTimeout && clearTimeout(loopTimeout);
  console.log('Loop stopped');
}

const playInstrument = (instrument: Instrument) => {
  console.log(`Playing ${instrument}`);
  switch (instrument) {
  case 'hihat':
    playHiHat();
    break;
  case 'snare':
    playSnare();
    break;
  case 'kick':
    playKick();
    break;
  case 'crash':
    playCrashCymbal();
    break;
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

// pads
type Instrument = 'hihat' | 'snare' | 'kick' | 'crash';

type Pad = {
    instrument: Instrument,
    button: Phaser.GameObjects.Rectangle,
}

const padColors: Record<Instrument, HexaColor> = {
  hihat: '#FDA341',
  kick: '#F24E1E',
  snare: '#4A90E2',
  crash: '#A0D8C5',
}

// controls
type ControlState = 'idle' | 'readyToRecord' | 'recording' | 'playing';

type Control = {
  button: Phaser.GameObjects.Rectangle,
  text: Phaser.GameObjects.Text,
};

const fontColors: Record<ControlState, HexaColor> = {
  idle: '#FFF',
  readyToRecord: '#0FF',
  recording: '#FD0041',
  playing: '#0F0',
}

export class KitScene extends Phaser.Scene {
  private controls!: {
    state: ControlState,
    stop: Control,
    record: Control,
    play: Control,
  }

  create () {
    this.createPads();
    this.createControlButtons();
  }

  private createPads() {
    const pads: Pad[] = [
      this.createPad('hihat'),
      this.createPad('kick'),
      this.createPad('snare'),
      this.createPad('crash'),
    ];

    pads.forEach(({button, instrument}) => button
      .setInteractive()
      .setOrigin(0, 0)
      .on('pointerdown', () => {
        button.setAlpha(0.7);
        if (this.controls.state === 'readyToRecord') {
          this.controls.state = 'recording';
          this.updateControlsText();
          startRecording();
        }
        playInstrument(instrument);
      }).on('pointerup', () => button.setAlpha(1))
      .on('pointerout', () => button.setAlpha(1))
    );

    const resizePads = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Update the pads
      pads[0].button.setSize(width / 2, height / 2).setPosition(0, 0);
      pads[1].button.setSize(width / 2, height / 2).setPosition(width / 2, 0);
      pads[2].button.setSize(width / 2, height / 2).setPosition(0, height / 2);
      pads[3].button.setSize(width / 2, height / 2).setPosition(width / 2, height / 2);
    };
    window.addEventListener('resize', resizePads);
    resizePads();
  }

  private createPad(instrument: Instrument): Pad {
    return {
      instrument,
      button: this.add.rectangle()
        .setFillStyle(hexToColor(padColors[instrument]))
        .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
    };
  }

  // controls below, TODO extract
  private createButton() {
    const button =  this.add.rectangle()
      .setFillStyle(hexToColor('#000'))
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setOrigin(0, 0);
    button.setInteractive()
      .on('pointerdown', () => button.setFillStyle(hexToColor('#666')))
      .on('pointerup', () => button.setFillStyle(hexToColor('#000')));
    return button;
  }

  private createText(text: string) {
    return this.add.text(0, 0, text)
      .setOrigin(0.5, 0.5)
      .setFontSize(20)
      .setFontFamily('Arial')
      .setAlign('center')
      .setColor('#FFF')
      .setData('initial', text);
  }

  private createControlButtons() {
    this.controls = {
      state: 'idle',
      stop: {
        button: this.createButton(),
        text: this.createText('Stop')
      },
      record: {
        button: this.createButton(),
        text: this.createText('Record')
      },
      play: {
        button: this.createButton(),
        text: this.createText('Play')
      },
    }

    const {record, stop, play} = this.controls;
    record.button.setInteractive()
      .on('pointerdown', () => {
        if (this.controls.state === 'idle' || this.controls.state === 'playing') {
          this.controls.state = 'readyToRecord';
          record.text.setText('Hit a pad to start');
        } else if (this.controls.state === 'readyToRecord') {
          this.controls.state = 'idle';
          record.text.setText(record.text.getData('initial'));
        } else if (this.controls.state === 'recording') {
          this.controls.state = 'idle';
          stopRecording();
        }
        this.updateControlsText();
      });
    stop.button.setInteractive()
      .on('pointerdown', () => {
        if (this.controls.state === 'recording') {
          stopRecording();
        }
        if (this.controls.state === 'playing') {
          stopPlaying();
        }
        this.controls.state = 'idle';
        this.updateControlsText();
      });
    play.button.setInteractive()
      .on('pointerdown', () => {
        if (this.controls.state === 'recording') {
          stopRecording();
        }
        this.controls.state = 'playing';
        // TODO show text record loop first when no loop
        startPlaying();
        this.updateControlsText();
      });

    const resizeControls = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const buttonHeight = Math.max(height, width) / 15;
      const buttonWidth = width / 3;

      [stop, record, play].forEach(({button, text}, index) => {
        button.setSize(buttonWidth, buttonHeight).setPosition(buttonWidth * index, -1);
        text.setFontSize(buttonHeight / 3)
          .setWordWrapWidth(button.width, true)
          .setSize(button.width, button.height)
          .setPosition(button.getCenter().x, button.getCenter().y);
      });
    };
    window.addEventListener('resize', resizeControls);
    resizeControls();
  }

  private updateControlsText() {
    const {
      record: {text: recordText},
      stop: {text: stopText},
      play: {text: playText}
    } = this.controls;
    [recordText, stopText, playText]
      .forEach(text => text.setText(text.getData('initial')).setColor(fontColors.idle));
    const color = fontColors[this.controls.state];
    switch (this.controls.state) {
    case 'idle':
      break;
    case 'readyToRecord':
      recordText.setText('Hit a pad to start').setColor(color);
      break;
    case 'recording':
      recordText.setText('Recording...').setColor(color);
      break;
    case 'playing':
      playText.setText('Playing...').setColor(color);
      break;
    }

  }
}


import Phaser from 'phaser';
import {playHiHat} from '../samples/hihat.ts';
import {playSnare} from '../samples/snare.ts';
import {playKick} from '../samples/kick.ts';
import {playCrashCymbal} from '../samples/crash.ts';

function startRecording() {
  console.log('Recording started');
}

function stopRecording() {
  console.log('Recording stopped');
}

function startPlaying() {
  console.log('Loop played');
}

function stopPlaying() {
  console.log('Loop stopped');
}

type ControlButton = {
  button: Phaser.GameObjects.Rectangle,
  text: Phaser.GameObjects.Text,
};

type HexaColor = `#${string}`;

const controlFonts: Record<ControlState, HexaColor> = {
  idle: '#FFF',
  readyToRecord: '#0FF',
  recording: '#FD0041',
  playing: '#0F0',
}

const colors = {
  fonts: controlFonts
}

type ControlState = 'idle' | 'readyToRecord' | 'recording' | 'playing';

export class KitScene extends Phaser.Scene {
  private controls: {
    state: ControlState,
    stop: ControlButton,
    record: ControlButton,
    play: ControlButton,
  }

  protected hexToColor(hex: string) {
    return Phaser.Display.Color.HexStringToColor(hex).color;
  }

  create () {
    this.createPads();
    this.createControlButtons();
  }

  private createPads() {
    const pads = [
      this.add.rectangle().setFillStyle(this.hexToColor('#FDA341')).on('pointerdown', () => playHiHat()),
      this.add.rectangle().setFillStyle(this.hexToColor('#F24E1E')).on('pointerdown', () => playKick()),
      this.add.rectangle().setFillStyle(this.hexToColor('#4A90E2')).on('pointerdown', () => playSnare()),
      this.add.rectangle().setFillStyle(this.hexToColor('#A0D8C5')).on('pointerdown', () => playCrashCymbal())
    ];

    pads.forEach(rectangle => rectangle
      .setInteractive()
      .setOrigin(0, 0)
      .on('pointerdown', () => {
        rectangle.setAlpha(0.7);
        if (this.controls.state === 'readyToRecord') {
          this.controls.state = 'recording';
          this.updateControlsText();
          startRecording();
        }
      }).on('pointerup', () => rectangle.setAlpha(1))
      .on('pointerout', () => rectangle.setAlpha(1))
    );

    const resizePads = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Update the pads
      pads[0].setSize(width / 2, height / 2).setPosition(0, 0);
      pads[1].setSize(width / 2, height / 2).setPosition(width / 2, 0);
      pads[2].setSize(width / 2, height / 2).setPosition(0, height / 2);
      pads[3].setSize(width / 2, height / 2).setPosition(width / 2, height / 2);
    };
    window.addEventListener('resize', resizePads);
    resizePads();
  }

  private createButton() {
    const button =  this.add.rectangle()
      .setFillStyle(this.hexToColor('#000'))
      .setStrokeStyle(2, this.hexToColor('#FFF'), 0.8)
      .setOrigin(0, 0);
    button.setInteractive()
      .on('pointerdown', () => button.setFillStyle(this.hexToColor('#666')))
      .on('pointerup', () => button.setFillStyle(this.hexToColor('#000')));
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
          //this.recordButton.setFillStyle(this.hexToColor('#AAA'));
        } else if (this.controls.state === 'recording') {
          this.controls.state = 'idle';
          stopRecording();
        }
        this.updateControlsText();
      });
    stop.button.setInteractive()
      .on('pointerdown', () => {
        this.controls.state = 'idle';
        if (this.controls.state === 'recording') {
          stopRecording();
        }
        if (this.controls.state === 'playing') {
          stopPlaying();
        }
        this.updateControlsText();
      });
    play.button.setInteractive()
      .on('pointerdown', () => {
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
      .forEach(text => text.setText(text.getData('initial')).setColor(colors.fonts.idle));
    const color = colors.fonts[this.controls.state];
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

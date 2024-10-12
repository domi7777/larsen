import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../colors.ts';
import {FontFamily} from '../fonts.ts';
import {loop, startPlaying, stopPlaying, stopRecording} from '../loops.ts';

type ControlState = 'idle' | 'readyToRecord' | 'recording' | 'playing';

type Control = {
  button: Phaser.GameObjects.Rectangle,
  text: Phaser.GameObjects.Text,
};

const controlColors: Record<ControlState, HexaColor> = {
  idle: '#FFF',
  readyToRecord: '#0FF',
  recording: '#FD0041',
  playing: '#0F0',
}

export class ControlsScene extends Phaser.Scene {
  public controls!: {
    state: ControlState,
    stop: Control,
    record: Control,
    play: Control,
  }

  static get controlsSceneHeight() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return Math.max(height, width) / 10;
  }
  constructor() {
    super('ControlsScene');
  }

  create() {
    this.createControlButtons();
  }

  updateControlsText() {
    const {
      record: {text: recordText},
      stop: {text: stopText},
      play: {text: playText}
    } = this.controls;
    // reset fonts to initial icons
    [recordText, stopText, playText].forEach(text => text
      .setFontFamily(FontFamily.Material)
      .setText(text.getData('initial'))
      .setColor(controlColors.idle));
    const color = controlColors[this.controls.state];
    switch (this.controls.state) {
    case 'idle':
      break;
    case 'readyToRecord':
      recordText.setFontFamily(FontFamily.Arial).setText('Hit a pad to start').setColor(color);
      break;
    case 'recording':
      recordText.setFontFamily(FontFamily.Material).setColor(color);
      break;
    case 'playing':
      playText.setFontFamily(FontFamily.Material).setColor(color);
      break;
    }
  }

  private addControlButton() {
    const button = this.add.rectangle()
      .setFillStyle(hexToColor('#000'))
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setOrigin(0, 0);
    button.setInteractive()
      .on('pointerdown', () => button.setFillStyle(hexToColor('#666')))
      .on('pointerup', () => button.setFillStyle(hexToColor('#000')))
      .on('pointerout', () => button.setFillStyle(hexToColor('#000')));
    return button;
  }

  private addControlText(text: string) {
    return this.add.text(0, 0, text, {
      fontFamily: FontFamily.Material,
      fontSize: 20,
      color: '#FFF',
      align: 'center',
      resolution: 2,
    })
      .setOrigin(0.5, 0.5)
      .setData('initial', text);
  }

  private createControlButtons() {
    this.controls = {
      state: 'idle',
      stop: {
        button: this.addControlButton(),
        text: this.addControlText('stop')
      },
      record: {
        button: this.addControlButton(),
        text: this.addControlText('fiber_manual_record')
      },
      play: {
        button: this.addControlButton(),
        text: this.addControlText('play_arrow')
      },
    }

    const {record, stop, play} = this.controls;
    record.button.setInteractive()
      .on('pointerdown', () => {
        if (this.controls.state === 'idle' || this.controls.state === 'playing') {
          stopPlaying();
          this.controls.state = 'readyToRecord';
        } else if (this.controls.state === 'readyToRecord') {
          this.controls.state = 'idle';
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
        if (loop.length > 0) {
          this.controls.state = 'playing';
          startPlaying();
          this.updateControlsText();
        } else {
          this.controls.state = 'idle';
          this.updateControlsText();
          console.log('No loop to play');
          this.controls.play.text.setFontFamily(FontFamily.Arial).setText('No loop to play, record first');
          this.time.delayedCall(2000, () => {
            this.updateControlsText();
          });
        }
      });

    const resizeControls = () => {
      const buttonHeight = ControlsScene.controlsSceneHeight;
      const buttonWidth = window.innerWidth / 3;

      [stop, record, play].forEach(({button, text}, index) => {
        button.setSize(buttonWidth, buttonHeight).setPosition(buttonWidth * index, -1);
        text.setFontSize(buttonHeight / 2)
          .setWordWrapWidth(button.width, true)
          .setSize(button.width, button.height)
          .setPosition(button.getCenter().x, button.getCenter().y);
      });
    };
    window.addEventListener('resize', resizeControls);
    resizeControls();
  }
}

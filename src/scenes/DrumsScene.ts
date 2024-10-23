import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../colors.ts';
import {startRecording} from '../loops.ts';
import {Instrument, playInstrument} from '../instruments.ts';
import {ControlsScene} from './ControlsScene.ts';
import {isDarkMode} from '../settings/color-settings.ts';

type Pad = {
    instrument: Instrument,
    button: Phaser.GameObjects.Rectangle,
}

const padColors: Record<Instrument, HexaColor> = {
  hihat: '#FDA341',
  kick: '#F24E1E',
  snare: '#4A90E2',
  crash: '#A0D8C5',
  'hihat-open': '#F9F871',
  ride: '#F5C542',
  'tom-low': '#FF7F50',
  'tom-high': '#9B59B6',
};

export class DrumsScene extends Phaser.Scene {

  constructor() {
    super('DrumsScene');
  }

  create() {
    this.createPads();
  }

  private createPads() {
    // change the order of the pads if needed, top to bottom and left to right
    const pads: Pad[] = [
      // top
      this.createPad('crash'),
      this.createPad('ride'),
      this.createPad('hihat-open'),
      this.createPad('hihat'),
      // bottom
      this.createPad('snare'),
      this.createPad('tom-low'),
      this.createPad('tom-high'),
      this.createPad('kick'),
    ];

    const resizePads = () => {
      const colNumber = 4;
      const rowNumber = 2;
      const width = window.innerWidth / colNumber;
      const height = (window.innerHeight - ControlsScene.controlsSceneHeight) / rowNumber;
      pads.forEach(({button}, index) => {
        const x = index % colNumber * width;
        const y = Math.floor(index / colNumber) * height;
        button.setSize(width, height).setPosition(x, ControlsScene.controlsSceneHeight + y);
      })
    };
    window.addEventListener('resize', resizePads);
    resizePads();
  }

  private createPad(instrument: Instrument): Pad {
    const button = this.add.rectangle()
      .setFillStyle(hexToColor(padColors[instrument], isDarkMode()))
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setInteractive()
      .setOrigin(0, 0);
    button.on('pointerdown', () => {
      button.setAlpha(0.7);
      const controlsScene = (this.scene.get('ControlsScene' as string) as ControlsScene);
      if (controlsScene.controls.state === 'readyToRecord') {
        controlsScene.controls.state = 'recording';
        controlsScene.updateControlsText();
        startRecording();
      }
      playInstrument(instrument);
    }).on('pointerup', () => button.setAlpha(1))
      .on('pointerout', () => button.setAlpha(1))
    return {
      instrument,
      button
    };
  }
}

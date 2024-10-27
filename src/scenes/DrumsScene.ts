import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../colors.ts';
import {Instrument, playInstrument} from '../instruments.ts';
import {LoopTracksScene} from './LoopTracksScene.ts';
import {rotateArray} from '../utils/math.ts';

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

type DrumsType= 'drums' | 'other';

export class DrumsScene extends Phaser.Scene {

  constructor(private type: DrumsType = 'drums') {
    super();
  }

  create({ type}: { type: DrumsType }) {
    if (type) {
      this.type = type;
    }
    this.createPads();
    this.scene.get(LoopTracksScene.key).events.emit('track-selected');
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
      const isPortrait = window.innerWidth < window.innerHeight;
      const colNumber = isPortrait ? 2 : 4;
      const rowNumber = isPortrait ? 4 : 2;
      const width = isPortrait ? window.innerWidth / colNumber : (window.innerWidth - LoopTracksScene.sceneWidthHeight) / colNumber;
      const height = isPortrait ? (window.innerHeight - LoopTracksScene.sceneWidthHeight) / rowNumber : window.innerHeight / rowNumber;

      const currentPads = isPortrait ?  rotateArray(pads, rowNumber, colNumber): pads;

      currentPads.forEach(({ button }, index) => {
        const x = (index % colNumber) * width;
        const y = Math.floor(index / colNumber) * height;
        const offsetX = isPortrait ? 0 : LoopTracksScene.sceneWidthHeight;
        const offsetY = isPortrait ? LoopTracksScene.sceneWidthHeight : 0;
        button.setSize(width, height).setPosition(offsetX + x, offsetY + y);
      });
    };

    // Attach the event listener and initial call
    window.addEventListener('resize', resizePads);
    resizePads();
  }

  private createPad(instrument: Instrument): Pad {
    const button = this.add.rectangle()
      .setFillStyle(hexToColor(padColors[instrument], this.type === 'drums'))
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setInteractive()
      .setOrigin(0, 0);
    button.on('pointerdown', () => {
      button.setAlpha(0.7);
      playInstrument(instrument);
      this.scene.get(LoopTracksScene.key).events.emit('instrument-played', {instrument, scene: this});
    }).on('pointerup', () => button.setAlpha(1))
      .on('pointerout', () => button.setAlpha(1))
    return {
      instrument,
      button
    };
  }
}

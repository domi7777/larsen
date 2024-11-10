import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../utils/colors.ts';
import {playSample, Sample} from '../samples/play-sample.ts';
import {LoopTracksScene} from './LoopTracksScene.ts';
import {rotateArray} from '../utils/math.ts';

type Pad = {
  instrument: Sample,
  button: Phaser.GameObjects.Rectangle,
}

const padColors: Record<Sample, HexaColor> = {
  hihat: '#FDA341',
  kick: '#F24E1E',
  snare: '#4A90E2',
  crash: '#A0D8C5',
  'hihat-open': '#F9F871',
  ride: '#F5C542',
  'tom-low': '#FF7F50',
  'tom-high': '#9B59B6',
};

type DrumsType = 'drums' | 'other';

export class DrumsScene extends Phaser.Scene {

  readonly settings = {
    volume: 100
  }

  constructor(private type: DrumsType = 'drums') {
    super();
  }

  create({type}: { type: DrumsType }) {
    if (type) {
      this.type = type;
    }
    this.createPads();
    this.scene.get(LoopTracksScene.key).events.emit('track-selected');
    this.game.events.emit('scene-change', this.settings);
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

      const currentPads = isPortrait ? rotateArray(pads, rowNumber, colNumber) : pads;

      currentPads.forEach(({button}, index) => {
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

  private createPad(instrument: Sample): Pad {
    const padColor = padColors[instrument];
    const inactiveColor = hexToColor(padColor, this.type === 'drums');
    const hitColor = Phaser.Display.Color.HexStringToColor(padColor).brighten(4).color;
    const button = this.add.rectangle()
      .setFillStyle(inactiveColor)
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setInteractive()
      .setOrigin(0, 0);
    button.on('pointerdown', (e: Phaser.Input.Pointer) => {
      if (e.downElement?.tagName?.toLowerCase() !== 'canvas') {
        return;
      }
      button.setFillStyle(hitColor);
      const callback = () => playSample(instrument, this.settings.volume);
      callback();
      this.scene.get(LoopTracksScene.key).events.emit('instrument-played', {callback, scene: this});
    }).on('pointerup', () => button.setFillStyle(inactiveColor))
      .on('pointerout', () => button.setFillStyle(inactiveColor));
    return {
      instrument,
      button
    };
  }
}

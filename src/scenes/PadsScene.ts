import Phaser from 'phaser';
import {LoopTracksScene} from './LoopTracksScene.ts';
import {rotateArray} from '../utils/math.ts';
import {hexToColor} from '../utils/colors.ts';
import {FontColor, FontFamily, FontSize} from '../utils/fonts.ts';
import {EVENTS} from '../events.ts';

type Pad = {
  instrument: number,
  button: Phaser.GameObjects.Rectangle,
  text?: Phaser.GameObjects.Text,
}

export abstract class PadsScene extends Phaser.Scene {

  private pads: Pad[] = [];
  readonly settings = {
    volume: 75
  }

  protected constructor(private cols: number, private rows: number) {
    super();
  }

  abstract playSound(index: number): void;
  abstract getPadText?(index: number): void;

  create() {
    this.createPads();
    this.scene.get(LoopTracksScene.key).events.emit('track-selected');
    this.game.events.emit(EVENTS.sceneChange, this.settings);
  }

  protected createPads() {
    const numberOfPads = this.cols * this.rows;
    this.pads = new Array(numberOfPads).fill(0).map((_, index) => {
      return this.createPad(index, numberOfPads);
    });

    const resizePads = () => {
      const isPortrait = window.innerWidth < window.innerHeight;
      const colNumber = isPortrait ? this.cols : this.rows;
      const rowNumber = isPortrait ? this.rows : this.cols;
      const width = isPortrait ? window.innerWidth / colNumber : (window.innerWidth - LoopTracksScene.sceneWidthHeight) / colNumber;
      const height = isPortrait ? (window.innerHeight - LoopTracksScene.sceneWidthHeight) / rowNumber : window.innerHeight / rowNumber;

      const currentPads = isPortrait ? rotateArray(this.pads, rowNumber, colNumber) : this.pads;

      currentPads.forEach(({button, text}, index) => {
        const x = (index % colNumber) * width;
        const y = Math.floor(index / colNumber) * height;
        const offsetX = isPortrait ? 0 : LoopTracksScene.sceneWidthHeight;
        const offsetY = isPortrait ? LoopTracksScene.sceneWidthHeight : 0;
        button.setSize(width, height).setPosition(offsetX + x, offsetY + y);
        if (text) {
          text.setPosition(button.getCenter().x, button.getCenter().y).setFontSize(FontSize.tiny).setResolution(2);
        }
      });
    };

    // Attach the event listener and initial call
    window.addEventListener('resize', resizePads);
    resizePads();
  }

  protected createPad(index: number, numberOfPads: number): Pad {
    const padColor = this.getPadColor(numberOfPads, index);
    const padText = this.getPadText?.(index);
    const inactiveColor = padColor.darken(60).color;
    const hitColor = padColor.brighten(40).color;
    const button = this.add.rectangle()
      .setFillStyle(inactiveColor)
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setInteractive()
      .setOrigin(0, 0);
    let buttonText: Pad['text'] = undefined;
    if (padText) {
      buttonText = this.add.text(0, 0, padText, {
        fontFamily: FontFamily.Text,
        fontSize: FontSize.tiny,
        color: FontColor.white,
      })
        .setAlpha(0.5)
        .setOrigin(0.5, 0.5)
        .setResolution(2)
        .setPosition(button.getCenter().x, button.getCenter().y)
        .setDepth(1);
    }
    let isActivated = false;
    const handlePadPress = () => {
      if (!isActivated) {
        this.playSound(index);
        button.setFillStyle(hitColor);
        this.scene.get(LoopTracksScene.key).events.emit(EVENTS.instrumentPlayed, {
          callback: () => this.playSound(index),
          scene: this
        });
        isActivated = true;
      }
    };
    const handlePadRelease = () => {
      button.setFillStyle(inactiveColor);
      isActivated = false;
    }
    button.on('pointerdown', (e: Phaser.Input.Pointer) => {
      if (e.downElement?.tagName?.toLowerCase() === 'canvas') {
        handlePadPress();
      }
    }).on('pointermove', (e: Phaser.Input.Pointer) => {
      if (e.isDown) {
        handlePadPress();
      }
    }).on('pointerup', () => handlePadRelease())
      .on('pointerout', () => handlePadRelease());
    return {
      instrument: index,
      button,
      text: buttonText,
    };
  }

  protected getPadColor(numberOfPads: number, index: number): Phaser.Display.Color {
    return Phaser.Display.Color.HSLToColor((numberOfPads - index) / (numberOfPads * 1.5), 1, 0.5);
  }
}

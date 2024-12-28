import Phaser from 'phaser';
import {LoopTracksScene} from '../LoopTracksScene.ts';
import {rotateArray} from '../../utils/math.ts';
import {colorToHex, PhaserColor, PhaserColors} from '../../utils/colors.ts';
import {FontColor, FontFamily, FontSize} from '../../utils/fonts.ts';
import {EVENTS} from '../../events.ts';
import {logger} from '../../utils/logger.ts';

type Pad = {
  instrument: number,
  button: Phaser.GameObjects.Rectangle,
  text?: Phaser.GameObjects.Text,
}

export type Setting = Partial<Omit<PadsSceneSettings, 'onChange'>>;

export type Range = {
  min: number;
  max: number;
};

export type PadsSceneSettings = {
  volume: number;
  noteDuration?: number;
  octaveRange?: Range;
  onChange?: (setting: Setting) => void;
}

export type PadText = {
  text: string,
  color?: PhaserColor,
  alpha?: number
};

export abstract class PadsScene extends Phaser.Scene {

  private pads: Pad[] = [];
  readonly settings: PadsSceneSettings = {
    volume: 50,
    onChange: (setting) => this.onSettingChange(setting),
  }

  public canRecord = true;
  public canPlay = true;

  public sceneText = '';
  public sceneTextColor: PhaserColor = PhaserColors.white;

  protected constructor(protected cols: number, protected rows: number) {
    super();
  }

  abstract playSound(index: number): void;

  create({color, text}: { color: PhaserColor, text: string }) {
    this.sceneText = text;
    this.sceneTextColor = color;
    this.createPads();
    this.game.events.emit(EVENTS.sceneChange, this.settings);
  }

  protected changePadNumber(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.scene.restart();
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
    const hitColor = this.getHitColor(numberOfPads, index);
    const padText = this.getPadText(index);
    const borderColor = this.getBorderColor(index);
    const button = this.add.rectangle()
      .setFillStyle(padColor.color)
      .setStrokeStyle(1, borderColor.color, 0.8)
      .setInteractive()
      .setOrigin(0, 0);
    let buttonText: Pad['text'] = undefined;
    if (padText) {
      buttonText = this.add.text(0, 0, padText.text, {
        fontFamily: FontFamily.Text,
        fontSize: FontSize.tiny,
        color: padText.color ? colorToHex(padText.color) : FontColor.white,
      })
        .setAlpha(padText.alpha ?? 0.5)
        .setOrigin(0.5, 0.5)
        .setResolution(2)
        .setPosition(button.getCenter().x, button.getCenter().y)
        .setDepth(1);
    }
    let isActivated = false;
    const handlePadPress = () => {
      if (!isActivated) {
        this.playSound(index);
        button.setFillStyle(hitColor.color);
        this.game.events.emit(EVENTS.instrumentPlayed, {
          callback: () => this.playSound(index),
          scene: this
        });
        isActivated = true;
      }
    };
    const handlePadRelease = () => {
      button.setFillStyle(padColor.color);
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
    // TODO move to colors.ts
    return Phaser.Display.Color.HSLToColor((numberOfPads - index) / (numberOfPads * 1.5), 1, 0.5);
  }

  protected getPadText(_index: number): PadText | undefined {
    return undefined;
  }

  onSettingChange(setting: Setting) {
    logger.log('Setting changed', JSON.stringify(setting));
  }

  protected getHitColor(numberOfPads: number, index: number): Phaser.Display.Color {
    return this.getPadColor(numberOfPads, index).brighten(40);
  }

  protected getBorderColor(_index: number): Phaser.Display.Color {
    return PhaserColors.darkGrey;
  }
}

import Phaser from 'phaser';

import {LoopTracksScene} from './LoopTracksScene.ts';
import {Colors, colorToHex, PhaserColor, PhaserColors} from '../utils/colors.ts';
import {FontFamily, FontSize} from '../utils/fonts.ts';
import {EVENTS} from '../events.ts';
import {InstrumentScene, instrumentScenes} from './instrumentScenes.ts';
import {LarsenGame} from '../Game.ts';

export class EmptyScene extends Phaser.Scene {
  static key = 'EmptyScene';
  private readonly rowNumber = 5;
  private readonly colNumber = 5;
  private instrumentButtons!: Phaser.GameObjects.Rectangle[][];
  private trackIndex!: number;

  public static sceneText = '+';
  public static sceneTextColor: PhaserColor = PhaserColors.white;

  constructor() {
    super(EmptyScene.key);
  }

  activateButton(
    row: number,
    col: number,
    instrumentScene : InstrumentScene,
  ) {
    const button = this.instrumentButtons[col][row];
    button.setData('text', this.addText(button, instrumentScene.text, instrumentScene.color))
      .setStrokeStyle(1, PhaserColors.grey.color)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.scene.setVisible(false);
        LarsenGame.instance.startInstrumentScene(this.trackIndex, instrumentScene);
      })
  }

  create({index: trackIndex}: { index: number }) {
    this.trackIndex = trackIndex;
    this.scene.bringToTop();
    this.game.events.emit(EVENTS.sceneChange);

    this.cameras.main
      .setOrigin(0, 0)
      .setBackgroundColor(Colors.black);

    this.createButtonsTable();

    this.activateButton(0, 0, instrumentScenes.synth);
    this.activateButton(1, 0, instrumentScenes.electroSynth);

    this.activateButton(0, 1, instrumentScenes.drums);

    this.activateButton(0, 2, instrumentScenes.gibberish);

    window.addEventListener('resize', () => this.resizeScene());
    this.resizeScene();
  }

  private createButtonsTable() {
    this.instrumentButtons = [];
    for (let i = 0; i < this.colNumber; i++) {
      this.instrumentButtons.push([]);
      for (let j = 0; j < this.rowNumber; j++) {
        this.instrumentButtons[i].push(
          this.add.rectangle()
            .setOrigin(0, 0)
            .setInteractive()
        );
      }
    }
  }

  private addText(button: Phaser.GameObjects.Rectangle, text: string, color: PhaserColor) {
    return this.add.text(button.x + button.width / 2, button.y + button.height / 2, text, {
      fontSize: FontSize.tiny,
      color: colorToHex(color.darken(20)),
      resolution: 2,
      fontFamily: FontFamily.Text,
    }).setOrigin(0.5);
  }

  private resizeScene() {
    const isPortrait = window.innerWidth < window.innerHeight;
    const sceneOffset = LoopTracksScene.sceneWidthHeight;
    const width = isPortrait ? window.innerWidth / this.colNumber : (window.innerWidth - sceneOffset) / this.colNumber;
    const height = isPortrait ? (window.innerHeight - sceneOffset) / this.rowNumber : window.innerHeight / this.rowNumber;

    // Resize and reposition buttons
    this.instrumentButtons.forEach((row, i) => {
      row.forEach((button, j) => {
        button.setSize(width, height).setPosition(width * i, height * j);
        const text: Phaser.GameObjects.Text | undefined = button.getData('text');
        if (text) {
          const fontSize = Math.min(button.height, button.width) / 5;
          text.setFontSize(fontSize)
            .setResolution(2)
            .setWordWrapWidth(button.width, true)
            .setSize(button.width, button.height)
            .setPosition(button.getCenter().x, button.getCenter().y);
        }
      });
    });

    // Configure camera
    const viewportWidth = isPortrait ? window.innerWidth : window.innerWidth - sceneOffset;
    const viewportHeight = isPortrait ? window.innerHeight - sceneOffset : window.innerHeight;
    const cameraX = isPortrait ? 0 : sceneOffset;
    const cameraY = isPortrait ? sceneOffset : 0;
    this.cameras.main
      .setPosition(cameraX, cameraY)
      .setViewport(cameraX, cameraY, viewportWidth, viewportHeight);
  }

}

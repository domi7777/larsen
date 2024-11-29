import Phaser from 'phaser';

import {LoopTracksScene} from './LoopTracksScene.ts';
import {hexToColor} from '../utils/colors.ts';
import {FontFamily} from '../utils/fonts.ts';
import {DrumsScene} from './DrumsScene.ts';
import {GibberishScene} from './GiberishScene.ts';
import {SimpleSynthScene} from './SimpleSynthScene.ts';
import {EVENTS} from '../events.ts';
import {DaftSynthScene} from './DaftSynthScene.ts';

export class EmptyScene extends Phaser.Scene {
  static key = 'EmptyScene';
  private readonly rowNumber = 5;
  private readonly colNumber = 5;
  private instrumentButtons!: Phaser.GameObjects.Rectangle[][];
  private trackIndex!: number;

  constructor() {
    super(EmptyScene.key);
  }

  activateButton({row, col, text, scene}: {
    row: number,
    col: number,
    text: string,
    scene: typeof Phaser.Scene | typeof SimpleSynthScene
  }) {
    const button = this.instrumentButtons[col][row];
    const trackSceneKey = LoopTracksScene.getTrackSceneKey(this.trackIndex);
    button.setData('text', this.addText(button, text))
      .setFillStyle(hexToColor('#FFF'), 0.5)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.scene.setVisible(false);
        this.scene.add(trackSceneKey, scene, true);
      })
  }

  create({index: trackIndex}: { index: number }) {
    this.trackIndex = trackIndex;
    this.scene.bringToTop();
    this.game.events.emit(EVENTS.sceneChange);

    this.cameras.main
      .setOrigin(0, 0)
      .setBackgroundColor('#147');

    this.createMatrix();

    this.activateButton({row: 1, col: 2, text: 'Drums', scene: DrumsScene});
    this.activateButton({row: 3, col: 2, text: 'Daft synth', scene: DaftSynthScene});
    this.activateButton({row: 2, col: 3, text: 'Gibberish', scene: GibberishScene});
    this.activateButton({row: 2, col: 1, text: 'Synth', scene: SimpleSynthScene});

    window.addEventListener('resize', () => this.resizeScene());
    this.resizeScene();
  }

  private createMatrix() {
    this.instrumentButtons = [];
    for (let i = 0; i < this.colNumber; i++) {
      this.instrumentButtons.push([]);
      for (let j = 0; j < this.rowNumber; j++) {
        this.instrumentButtons[i].push(
          this.add.rectangle()
            .setOrigin(0, 0)
            .setStrokeStyle(2, hexToColor('#FFF'), 0.1)
            .setInteractive()
        );
      }
    }
  }

  private addText(button: Phaser.GameObjects.Rectangle, text: string) {
    return this.add.text(button.x + button.width / 2, button.y + button.height / 2, text, {
      fontSize: '24px',
      color: '#FFF',
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

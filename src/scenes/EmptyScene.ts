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

  constructor() {
    super(EmptyScene.key);
  }

  create({index: trackIndex}: { index: number }) {
    this.scene.bringToTop();
    this.game.events.emit(EVENTS.sceneChange);

    this.cameras.main
      .setOrigin(0, 0)
      .setBackgroundColor('#147');

    this.createMatrix();

    const simpleSynthButton = this.instrumentButtons[2][1];
    simpleSynthButton.setData('text', this.addText(simpleSynthButton, 'Simple Synth'));

    const drumsButton = this.instrumentButtons[1][2];
    drumsButton.setData('text', this.addText(drumsButton, 'Drums'));

    const daftSynthButton = this.instrumentButtons[3][2];
    daftSynthButton.setData('text', this.addText(daftSynthButton, 'Daft synth'));

    const gibberishButton = this.instrumentButtons[2][3];
    gibberishButton.setData('text', this.addText(gibberishButton, 'Gibberish'));

    const activeButtons = [
      drumsButton,
      daftSynthButton,
      gibberishButton,
      simpleSynthButton
    ];
    activeButtons.forEach(button => button
      .setFillStyle(hexToColor('#FFF'), 0.5)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.scene.setVisible(false);
      })
    );
    const trackSceneKey = LoopTracksScene.getTrackSceneKey(trackIndex);

    drumsButton.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.add(trackSceneKey, DrumsScene, true, {type: 'drums'});
    });
    daftSynthButton.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.add(trackSceneKey, DaftSynthScene, true);
    });
    gibberishButton.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.add(trackSceneKey, GibberishScene, true, {numberOfPads: 8});
    });
    simpleSynthButton.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.add(trackSceneKey, SimpleSynthScene, true);
    });

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

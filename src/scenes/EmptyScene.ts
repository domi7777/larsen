import Phaser from 'phaser';

import {LoopTracksScene} from './LoopTracksScene.ts';
import {hexToColor} from '../colors.ts';
import {FontFamily} from '../fonts.ts';
import {DrumsScene} from './DrumsScene.ts';

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
    this.cameras.main
      .setOrigin(0, 0)
      .setBackgroundColor('#147');

    this.createMatrix();

    const drumsButton = this.instrumentButtons[1][2];
    drumsButton.setData('text', this.addText(drumsButton, 'Drums'));

    const otherDrumsButton = this.instrumentButtons[3][2];
    otherDrumsButton.setData('text', this.addText(otherDrumsButton, 'Other Drums'));

    const activeButtons = [
      drumsButton,
      otherDrumsButton,
    ];
    activeButtons.forEach(button => button
      .setFillStyle(hexToColor('#FFF'), 0.5)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.scene.setVisible(false);
      })
    );
    const trackSceneKey = `track_scene_${trackIndex}`;

    drumsButton.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.add(trackSceneKey, DrumsScene, true, {type: 'drums'});
    });
    otherDrumsButton.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.add(trackSceneKey, DrumsScene, true, {type: 'other'});
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

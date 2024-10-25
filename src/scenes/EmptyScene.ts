import Phaser from 'phaser';

import {LoopTracksScene} from './LoopTracksScene.ts';
import {hexToColor} from '../colors.ts';
import {FontFamily} from '../fonts.ts';
import {DrumsScene} from './DrumsScene.ts';

export class EmptyScene extends Phaser.Scene {
  constructor() {
    super('EmptyScene');
  }

  create({index: trackIndex}: {index: number}) {
    this.scene.bringToTop();
    this.cameras.main
      .setOrigin(0, 0)
      .setPosition(LoopTracksScene.sceneWidth, 0)
      .setViewport(LoopTracksScene.sceneWidth, 0, window.innerWidth - LoopTracksScene.sceneWidth, window.innerHeight)
      .setBackgroundColor('#147');
    // divide the scene into 16 equal parts
    const colNumber = 5;
    const rowNumber = 5;
    const width = (window.innerWidth - LoopTracksScene.sceneWidth) / colNumber;
    const height = window.innerHeight / rowNumber;
    // create matrix of buttons
    const instrumentButtons: Phaser.GameObjects.Rectangle[][] = [];
    for (let i = 0; i < colNumber; i++) {
      instrumentButtons.push([]);
      for (let j = 0; j < rowNumber; j++) {
        instrumentButtons[i].push(
          this.add.rectangle()
            .setOrigin(0, 0)
            .setPosition( i * width, j * height)
            .setSize(width, height)
            .setStrokeStyle(2, hexToColor('#FFF'), 0.1)
        );
      }
    }
    const drumsButton = instrumentButtons[1][2];
    this.addText(drumsButton, 'Drums');

    const otherDrumsButton = instrumentButtons[3][2];
    this.addText(otherDrumsButton, 'Other Drums');

    const activeButtons = [
      drumsButton,
      otherDrumsButton,
    ];
    activeButtons.forEach(button => button
      .setFillStyle(hexToColor('#FFF'), 0.5)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => button.setFillStyle(hexToColor('#FFF'), 0.8))
      .on(Phaser.Input.Events.POINTER_UP, () => button.setFillStyle(hexToColor('#FFF'), 0.5))
    );
    const trackSceneKey = `track_scene_${trackIndex}`;
    drumsButton.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.setVisible(false);
      this.scene.add(trackSceneKey, DrumsScene, true, {type: 'drums'});
    });
    otherDrumsButton.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.setVisible(false);
      this.scene.add(trackSceneKey, DrumsScene, true, {type: 'other'});
    });
  }

  private addText(button: Phaser.GameObjects.Rectangle, text: string) {
    this.add.text(button.x + button.width / 2, button.y + button.height / 2, text, {
      fontSize: '24px',
      color: '#FFF',
      fontFamily: FontFamily.Text,
    }).setOrigin(0.5);
  }
}

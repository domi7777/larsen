
import Phaser from 'phaser';
import {playHiHat} from '../samples/hihat.ts';
import {playSnare} from '../samples/snare.ts';
import {playKick} from '../samples/kick.ts';
import {playCrashCymbal} from '../samples/crash.ts';

export class KitScene extends Phaser.Scene {

  protected hexToColor(hex: string) {
    return Phaser.Display.Color.HexStringToColor(hex).color;
  }

  create () {
    const rectangles = [
      this.add.rectangle().setFillStyle(this.hexToColor('#FDA341')).on('pointerdown', () =>  playHiHat()),
      this.add.rectangle().setFillStyle(this.hexToColor('#F24E1E')).on('pointerdown', () =>  playKick()),
      this.add.rectangle().setFillStyle(this.hexToColor('#4A90E2')).on('pointerdown', () =>  playSnare()),
      this.add.rectangle().setFillStyle(this.hexToColor('#A0D8C5')).on('pointerdown', () =>  playCrashCymbal())
    ];
    rectangles.forEach(rectangle => rectangle
      .setInteractive()
      .setOrigin(0, 0)
      .on('pointerdown', () => {
        rectangle.setAlpha(0.7);
        this.tweens.add({
          targets: rectangle,
          alpha: 1,
          duration: 250
        });
      })
    );

    const resizePads = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Update the rectangles
      rectangles[0].setSize(width / 2, height / 2).setPosition(0, 0);
      rectangles[1].setSize(width / 2, height / 2).setPosition(width / 2, 0);
      rectangles[2].setSize(width / 2, height / 2).setPosition(0, height / 2);
      rectangles[3].setSize(width / 2, height / 2).setPosition(width / 2, height / 2);
    };
    window.addEventListener('resize', resizePads);
    resizePads();
  }
}

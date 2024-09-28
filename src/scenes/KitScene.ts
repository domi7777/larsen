
import Phaser from 'phaser';
import {playHiHat} from '../samples/hihat.ts';
import {playSnare} from '../samples/snare.ts';
import {playKick} from '../samples/kick.ts';
import {playCrashCymbal} from '../samples/crash.ts';

export class KitScene extends Phaser.Scene {

  get gameWidth() {
    return window.innerWidth;
  }

  get gameHeight() {
    return window.innerHeight;
  }

  protected hexToColor(hex: string) {
    return Phaser.Display.Color.HexStringToColor(hex).color;
  }

  create () {
    const rectangles = [
      this.add.rectangle(0, 0, this.gameWidth/2, this.gameHeight/2, this.hexToColor('#FDA341'))
        .setInteractive()
        .setOrigin(0, 0)
        .on('pointerdown', () =>  playHiHat()),
      this.add.rectangle(this.gameWidth/2, 0, this.gameWidth/2, this.gameHeight/2, this.hexToColor('#FE5156'))
        .setInteractive()
        .setOrigin(0, 0)

        .on('pointerdown', () =>  playSnare()),
      this.add.rectangle(0, this.gameHeight/2, this.gameWidth/2, this.gameHeight/2, this.hexToColor('#4A90E2'))
        .setInteractive()
        .setOrigin(0, 0)

        .on('pointerdown', () =>  playKick()),
      this.add.rectangle(this.gameWidth/2, this.gameHeight/2, this.gameWidth/2, this.gameHeight/2, this.hexToColor('#C56BFE'))
        .setInteractive()
        .setOrigin(0, 0)
        .on('pointerdown', () =>  playCrashCymbal())
    ];
    window.addEventListener('resize', () => {
      const width = this.gameWidth;
      const height = this.gameHeight;
      // Update the rectangles
      rectangles[0].setSize(width / 2, height / 2).setPosition(0, 0);
      rectangles[1].setSize(width / 2, height / 2).setPosition(width / 2, 0);
      rectangles[2].setSize(width / 2, height / 2).setPosition(0, height / 2);
      rectangles[3].setSize(width / 2, height / 2).setPosition(width / 2, height / 2);
    });
  }
}

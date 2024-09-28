
import Phaser from 'phaser';
import {playHiHat} from '../samples/hihat.ts';
import {playSnare} from '../samples/snare.ts';
import {playKick} from '../samples/kick.ts';
import {playCrashCymbal} from '../samples/crash.ts';

export class KitScene extends Phaser.Scene {

  get gameWidth() {
    return this.game.canvas.width;
  }

  get gameHeight() {
    return this.game.canvas.height;
  }

  protected hexToColor(hex: string) {
    return Phaser.Display.Color.HexStringToColor(hex).color;
  }

  create () {
    this.add.rectangle(0, 0, this.gameWidth/2, this.gameHeight/2, this.hexToColor('#FDA341'))
      .setInteractive()
      .on('pointerdown', () =>  playHiHat());
    this.add.rectangle(this.gameWidth/2, 0, this.gameWidth/2, this.gameHeight/2, this.hexToColor('#FE5156'))
      .setInteractive()
      .on('pointerdown', () =>  playSnare());
    this.add.rectangle(0, this.gameHeight/2, this.gameWidth/2, this.gameHeight/2, this.hexToColor('#4A90E2'))
      .setInteractive()
      .on('pointerdown', () =>  playKick());
    this.add.rectangle(this.gameWidth/2, this.gameHeight/2, this.gameWidth/2, this.gameHeight/2, this.hexToColor('#C56BFE'))
      .setInteractive()
      .on('pointerdown', () =>  playCrashCymbal());
  }
}

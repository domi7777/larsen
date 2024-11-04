import Phaser from 'phaser';
import {LoopTracksScene} from './LoopTracksScene.ts';
import {rotateArray} from '../utils/math.ts';
import {hexToColor} from '../utils/colors.ts';

type Pad = {
  instrument: number,
  button: Phaser.GameObjects.Rectangle,
}
export abstract class PadsScene extends Phaser.Scene {

  private pads: Pad[] = [];
  protected constructor(private cols: number, private rows: number) {
    super();
  }

  abstract playSound(index: number): void;

  create() {
    this.createPads();
    this.scene.get(LoopTracksScene.key).events.emit('track-selected');
  }

  protected createPads(){
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

      const currentPads = isPortrait ?  rotateArray(this.pads, rowNumber, colNumber): this.pads;

      currentPads.forEach(({ button }, index) => {
        const x = (index % colNumber) * width;
        const y = Math.floor(index / colNumber) * height;
        const offsetX = isPortrait ? 0 : LoopTracksScene.sceneWidthHeight;
        const offsetY = isPortrait ? LoopTracksScene.sceneWidthHeight : 0;
        button.setSize(width, height).setPosition(offsetX + x, offsetY + y);
      });
    };

    // Attach the event listener and initial call
    window.addEventListener('resize', resizePads);
    resizePads();
  }

  protected createPad(index: number, numberOfPads: number): Pad {
    const padColor = Phaser.Display.Color.HSLToColor((numberOfPads - index) / (numberOfPads * 1.5), 1, 0.5)
    const inactiveColor = padColor.darken(40).color;
    const hitColor = padColor.brighten(4).color;
    const button = this.add.rectangle()
      .setFillStyle(inactiveColor)
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setInteractive()
      .setOrigin(0, 0);
    button.on('pointerdown', (e: Phaser.Input.Pointer) => {
      if (e.downElement?.tagName?.toLowerCase() !== 'canvas') {
        return;
      }
      this.playSound(index);
      button.setFillStyle(hitColor);
      // TODO send a call to the loop scene to play the instrument ? or an object
      // this.scene.get(LoopTracksScene.key).events.emit('instrument-played', {instrument, scene: this});
    }).on('pointerup', () => button.setFillStyle(inactiveColor))
      .on('pointerout', () => button.setFillStyle(inactiveColor));
    return {
      instrument: index,
      button
    };
  }

}

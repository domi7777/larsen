import Phaser from 'phaser';
import {KitScene} from './scenes/KitScene.ts';

let isGameInitialized = false;

export const Kit = () => {
  if (!isGameInitialized) {
    isGameInitialized = true;
    new Phaser.Game({
      type: Phaser.AUTO,
      mode: Phaser.Scale.RESIZE,
      parent: 'phaser-container',
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [
        KitScene
      ],
    });
    return <></>;
  }
}

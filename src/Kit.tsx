import Phaser from 'phaser';
import {KitScene} from './scenes/KitScene.ts';

function resizeGame(game: Phaser.Game) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  game.scale.resize(width, height);
  game.scene.scenes.forEach(scene => {
    if (scene instanceof Phaser.Scene && scene.sys.scale) {
      scene.sys.scale.refresh();
    }
  });
}

let isGameInitialized = false;

export const Kit = () => {
  if (!isGameInitialized) {
    isGameInitialized = true;
    const game =new Phaser.Game({
      type: Phaser.AUTO,
      mode: Phaser.Scale.RESIZE,
      parent: 'phaser-container',
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [
        KitScene
      ],
    });
    window.addEventListener('resize', () => {
      resizeGame(game);
    });
    return <></>;
  }
}

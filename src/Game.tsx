import Phaser from 'phaser';
import {DrumsScene} from './scenes/DrumsScene.ts';
import {loadFonts} from './fonts.ts';
import {ControlsScene} from './scenes/ControlsScene.ts';

function resizeGame(game: Phaser.Game) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  game.scale.resize(width, height);
  game.scene.scenes.forEach(scene => scene.sys?.scale?.refresh());
}

let isGameInitialized = false;

export const Game = () => {
  if (!isGameInitialized) {
    isGameInitialized = true;
    loadFonts().then(() => {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-container',
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#FFF',
        scene: [
          ControlsScene,
          DrumsScene,
        ],
        input: {
          activePointers: 4, // Allow four active pointers for multi-touch
        },
      });
      window.addEventListener('resize', () => {
        resizeGame(game);
      });
      game.scene.start('ControlsScene');
      game.scene.start('DrumsScene');
    });
  }
  return <></>;
}

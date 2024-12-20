import Phaser from 'phaser';
import {loadFonts} from './utils/fonts.ts';
import {LoopTracksScene} from './scenes/LoopTracksScene.ts';
import {isDarkMode} from './settings/color-settings.ts';
import {EmptyScene} from './scenes/EmptyScene.ts';
import {TweakPane} from './settings/TweakPane.ts';
import {Colors} from './utils/colors.ts';

function resizeGame(game: Phaser.Game) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  game.scale.resize(width, height);
  game.scene.scenes.forEach(scene => scene.sys?.scale?.refresh());
}

let isGameInitialized = false;

export const createGame = () => {
  if (!isGameInitialized) {
    isGameInitialized = true;
    loadFonts().then(() => {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-container',
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: isDarkMode() ? Colors.black : Colors.white,
        scene: [
          LoopTracksScene,
          EmptyScene,
        ],
        input: {
          activePointers: 8, // how many pointers can be active at once
        },
      });
      const tweakPane = new TweakPane(game);
      window.addEventListener('resize', () => {
        resizeGame(game);
        tweakPane.resize();
      });
      game.scene.start(LoopTracksScene.key);
      resizeGame(game);
    });
  }
}

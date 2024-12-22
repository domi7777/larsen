import Phaser from 'phaser';
import {loadFonts} from './utils/fonts.ts';
import {LoopTracksScene} from './scenes/LoopTracksScene.ts';
import {isDarkMode} from './settings/color-settings.ts';
import {EmptyScene} from './scenes/EmptyScene.ts';
import {TweakPane} from './settings/TweakPane.ts';
import {Colors} from './utils/colors.ts';

export class LarsenGame extends Phaser.Game {
  static isInitialized = false;
  static instance: LarsenGame;

  static async createGame() {
    if (!LarsenGame.isInitialized) {
      await loadFonts();
      this.instance = new LarsenGame();
    }
  }

  constructor() {
    super({
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
    const tweakPane = new TweakPane(this);
    window.addEventListener('resize', () => {
      this.resizeGame();
      tweakPane.resize();
    });
    this.scene.start(LoopTracksScene.key);
    this.events.on('ready', () => {
      this.scene.start(EmptyScene.key);
    });
    this.resizeGame();
  }

  private resizeGame() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scale.resize(width, height);
    this.scene.scenes.forEach(scene => scene.sys?.scale?.refresh());
  }

}

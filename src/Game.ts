import Phaser from 'phaser';
import {loadFonts} from './utils/fonts.ts';
import {LoopTracksScene} from './scenes/LoopTracksScene.ts';
import {isDarkMode} from './settings/color-settings.ts';
import {EmptyScene} from './scenes/EmptyScene.ts';
import {TweakPane} from './settings/TweakPane.ts';
import {Colors} from './utils/colors.ts';
import {InstrumentScene, instrumentScenes} from './scenes/instrumentScenes.ts';

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
      console.log('ready');
      // TODO eventually restore previous state
      this.startInstrumentScene(2, instrumentScenes.electroSynth);
      this.startInstrumentScene(1, instrumentScenes.synth);
      this.startInstrumentScene(0, instrumentScenes.drums);
    });
    this.resizeGame();
  }

  private resizeGame() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scale.resize(width, height);
    this.scene.scenes.forEach(scene => scene.sys?.scale?.refresh());
  }

  startInstrumentScene(trackIndex: number, instrumentScene: InstrumentScene) {
    const {clazz, ...rest} = instrumentScene;
    this.scene.add(
      LoopTracksScene.getTrackSceneKey(trackIndex),
      clazz,
      true,
      {...rest}
    );
  }

}

import Phaser from 'phaser';
import {PhaserColor, PhaserColors} from '../utils/colors.ts';
import {GibberishScene} from './GiberishScene.ts';
import {DrumsScene} from './DrumsScene.ts';
import {DaftSynthScene} from './DaftSynthScene.ts';
import {SimpleSynthScene} from './SimpleSynthScene.ts';
import {ValueOf} from '../utils/types.ts';

export const instrumentScenes = {
  synth: {
    get color() {
      return PhaserColors.blue
    },
    text: 'Piano',
    clazz: SimpleSynthScene,
  },
  electroSynth: {
    get color() {
      return PhaserColors.purple
    },
    text: 'Electro',
    clazz: DaftSynthScene,
  },
  drums: {
    get color() {
      return PhaserColors.red
    },
    text: 'Drums',
    clazz: DrumsScene,
  },
  gibberish: {
    get color() {
      return PhaserColors.green
    },
    text: 'Gibberish',
    clazz: GibberishScene,
  },
} satisfies Record<string, {
  color: PhaserColor;
  text: string;
  clazz: typeof Phaser.Scene;
}>;

export type InstrumentScene = ValueOf<typeof instrumentScenes>;

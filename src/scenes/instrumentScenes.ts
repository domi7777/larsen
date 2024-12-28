import Phaser from 'phaser';
import {PhaserColor, PhaserColors} from '../utils/colors.ts';
import {GibberishScene} from './GiberishScene.ts';
import {DrumsScene} from './DrumsScene.ts';
import {ElectroScene} from './ElectroScene.ts';
import {PianoScene} from './PianoScene.ts';
import {ValueOf} from '../utils/types.ts';

export const instrumentScenes = {
  synth: {
    get color() {
      return PhaserColors.blue
    },
    text: 'Piano',
    clazz: PianoScene,
  },
  electroSynth: {
    get color() {
      return PhaserColors.purple
    },
    text: 'Electro',
    clazz: ElectroScene,
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
  clazz: typeof Phaser.Scene | typeof PianoScene | typeof ElectroScene | typeof DrumsScene | typeof GibberishScene;
}>;

export type InstrumentScene = ValueOf<typeof instrumentScenes>;

import Phaser from 'phaser';
import {PhaserColor, PhaserColors} from '../utils/colors.ts';
import {GibberishScene} from './GiberishScene.ts';
import {DrumsScene} from './DrumsScene.ts';
import {DaftSynthScene} from './DaftSynthScene.ts';
import {SimpleSynthScene} from './SimpleSynthScene.ts';
import {ValueOf} from '../utils/types.ts';

export const instrumentScenes = {
  synth: {
    color: PhaserColors.blue,
    text: 'Synth',
    clazz: SimpleSynthScene,
  },
  daftSynth: {
    color: PhaserColors.purple,
    text: 'Daft synth',
    clazz: DaftSynthScene,
  },
  drums: {
    color: PhaserColors.red,
    text: 'Drums',
    clazz: DrumsScene,
  },
  gibberish: {
    color: PhaserColors.green,
    text: 'Gibberish',
    clazz: GibberishScene,
  },
} satisfies Record<string, {
  color: PhaserColor;
  text: string;
  clazz: typeof Phaser.Scene;
}>;

export type InstrumentScene = ValueOf<typeof instrumentScenes>;

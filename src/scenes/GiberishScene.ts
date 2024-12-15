import {logger} from '../utils/logger.ts';
import {PadsScene} from './PadsScene.ts';
import Phaser from 'phaser';
import {PhaserColors} from '../utils/colors.ts';

declare const Freeverb: any, Bus2: any, Gibberish: any, Synth: any, Add: any, Sine: any, Sequencer: any;

let noteSeq: any = null;
let bassSeq: any = null;

const testNote = () => {
  if (noteSeq) {
    logger.log('stopping note...', noteSeq);
    noteSeq.stop();
    bassSeq.stop();
  }
  logger.log('testing note...');

  const beat = 22050

  // global reverb object
  const verb = Freeverb({input: Bus2(), roomSize: .975, damping: .5}).connect()

  /*** bassline ***/
  const bass = Synth({
    gain: .15,
    attack: 44,
    decay: 5512,
    Q: .8, // CAREFUL!!!
    filterType: 2,
    saturation: 2,
    filterMult: 3.25,
    antialias: true,
    cutoff: Add(1, Sine({frequency: .1, gain: .75}))
  })
    .connect(Gibberish.output)
    .connect(verb.input, .5)

  const bassNotes = [55, 110, 165, 220]
  bassSeq = Sequencer.make([55, 110, 165, 220], [beat / 4], bass, 'note').start()
  noteSeq = Sequencer.make(
    [
      bassNotes.map(v => v * 1.25),
      bassNotes.map(v => v * 1.25 * .8),
      bassNotes.map(v => v * 1.25 * .8 * .8),
      bassNotes.map(v => v * 1.25 * .8 * .8 * 1.25),
    ],
    [beat * 16],
    bassSeq,
    'values'
  );
  noteSeq.start();
}

export class GibberishScene extends PadsScene {

  canRecord = false;
  canPlay = false;
  isGibberishLoaded = false;

  playSound(_index: number): void {
    if (!this.isGibberishLoaded) {
      this.isGibberishLoaded = true;
      Gibberish.workletPath = './worklet.js';
      logger.log('loading Gibberish 2...');
      Gibberish.init().then(() => {
        logger.log('Gibberish is ready!')
        Gibberish.export(window)
        testNote();
      }).catch((e: unknown) => logger.error('oops', e));
    } else {
      testNote();
    }
  }

  constructor() {
    super(1 , 1);
  }

  protected getPadColor(_numberOfPads: number, _index: number): Phaser.Display.Color {
    return PhaserColors.black;
  }

  protected getPadText(_index: number): { text: string; color: Phaser.Display.Color } {
    return { text: 'Play Gibberish', color: PhaserColors.green };
  }
}

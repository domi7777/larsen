import Phaser from 'phaser';
import {hexToColor} from '../utils/colors.ts';
import {LoopTracksScene} from './LoopTracksScene.ts';
import {rotateArray} from '../utils/math.ts';

type Pad = {
    instrument: number,
    button: Phaser.GameObjects.Rectangle,
}

declare const Freeverb: any, Bus2: any, Gibberish: any, Synth: any, Add: any, Sine: any, Sequencer: any;

let noteSeq: any = null;
let bassSeq: any = null;

const testNote = () => {
  if (noteSeq) {
    console.log('stopping note...', noteSeq);
    noteSeq.stop();
    bassSeq.stop();
  }
  console.log('testing note...');

  const beat = 22050

  // global reverb object
  const verb = Freeverb({ input:Bus2(), roomSize:.975, damping:.5 }).connect()

  /*** bassline ***/
  const bass = Synth({
    gain:.15,
    attack:44,
    decay: 5512,
    Q:.8, // CAREFUL!!!
    filterType:2,
    saturation:2,
    filterMult:3.25,
    antialias:true,
    cutoff: Add( 1, Sine({ frequency:.1, gain:.75 }) )
  })
    .connect( Gibberish.output )
    .connect( verb.input, .5 )

  const bassNotes = [55,110,165,220]
  bassSeq = Sequencer.make( [55,110,165,220], [beat/4], bass, 'note' ).start()
  noteSeq = Sequencer.make(
    [
      bassNotes.map( v=>v*1.25 ),
      bassNotes.map( v=>v*1.25*.8 ),
      bassNotes.map( v=>v*1.25*.8*.8 ),
      bassNotes.map( v=>v*1.25*.8*.8*1.25 ),
    ],
    [beat*16],
    bassSeq,
    'values'
  );
  noteSeq.start();
}

export class GibberishScene extends Phaser.Scene {

  isGibberishLoaded = false;

  constructor() {
    super();
  }

  create({ numberOfPads = 8 }: { numberOfPads: number}) {
    this.createPads(numberOfPads);
    this.scene.get(LoopTracksScene.key).events.emit('track-selected');
  }

  private createPads(numberOfPads: number) {
    // change the order of the pads if needed, top to bottom and left to right
    const pads: Pad[] = new Array(numberOfPads).fill(0).map((_, index) => {
      return this.createPad(index);
    });

    const resizePads = () => {
      const isPortrait = window.innerWidth < window.innerHeight;
      const colNumber = isPortrait ? 2 : 4;// FIXME should depend on numberOfPads
      const rowNumber = isPortrait ? 4 : 2;
      const width = isPortrait ? window.innerWidth / colNumber : (window.innerWidth - LoopTracksScene.sceneWidthHeight) / colNumber;
      const height = isPortrait ? (window.innerHeight - LoopTracksScene.sceneWidthHeight) / rowNumber : window.innerHeight / rowNumber;

      const currentPads = isPortrait ?  rotateArray(pads, rowNumber, colNumber): pads;

      currentPads.forEach(({ button }, index) => {
        const x = (index % colNumber) * width;
        const y = Math.floor(index / colNumber) * height;
        const offsetX = isPortrait ? 0 : LoopTracksScene.sceneWidthHeight;
        const offsetY = isPortrait ? LoopTracksScene.sceneWidthHeight : 0;
        button.setSize(width, height).setPosition(offsetX + x, offsetY + y);
      });
    };

    // Attach the event listener and initial call
    window.addEventListener('resize', resizePads);
    resizePads();
  }

  private createPad(index: number): Pad {
    const padColor = Phaser.Display.Color.HSLToColor(index / 16, 1, 0.5)
    const inactiveColor = padColor.darken(40).color;
    const hitColor = padColor.brighten(4).color;
    const button = this.add.rectangle()
      .setFillStyle(inactiveColor)
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setInteractive()
      .setOrigin(0, 0);
    button.on('pointerdown', (e: Phaser.Input.Pointer) => {
      if (e.downElement?.tagName?.toLowerCase() !== 'canvas') {
        return;
      }
      if (!this.isGibberishLoaded) {
        this.isGibberishLoaded = true;
        Gibberish.workletPath = './worklet.js';
        console.log('loading Gibberish 2...');
        Gibberish.init().then(() => {
          console.log('Gibberish is ready!')
          Gibberish.export(window)
          testNote();
        }).catch((e: unknown) => console.error('oops', e));
      } else {
        testNote();
      }
      button.setFillStyle(hitColor);
      // TODO send a call to the loop scene to play the instrument ? or an object
      // this.scene.get(LoopTracksScene.key).events.emit('instrument-played', {instrument, scene: this});
    }).on('pointerup', () => button.setFillStyle(inactiveColor))
      .on('pointerout', () => button.setFillStyle(inactiveColor));
    return {
      instrument: index,
      button
    };
  }
}

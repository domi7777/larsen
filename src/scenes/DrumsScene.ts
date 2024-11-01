import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../utils/colors.ts';
import {playSample, Sample} from '../samples/play-sample.ts';
import {LoopTracksScene} from './LoopTracksScene.ts';
import {rotateArray} from '../utils/math.ts';

type Pad = {
    instrument: Sample,
    button: Phaser.GameObjects.Rectangle,
}

const padColors: Record<Sample, HexaColor> = {
  hihat: '#FDA341',
  kick: '#F24E1E',
  snare: '#4A90E2',
  crash: '#A0D8C5',
  'hihat-open': '#F9F871',
  ride: '#F5C542',
  'tom-low': '#FF7F50',
  'tom-high': '#9B59B6',
};

declare const Freeverb: any, Bus2: any, Gibberish: any, Synth: any, Add: any, Sine: any, Sequencer: any;

type DrumsType= 'drums' | 'other';

const testNote = () => {
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
  const bassSeq = Sequencer.make( [55,110,165,220], [beat/4], bass, 'note' ).start()
  const noteSeq = Sequencer.make(
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

export class DrumsScene extends Phaser.Scene {

  constructor(private type: DrumsType = 'drums') {
    super();
  }

  create({ type}: { type: DrumsType }) {
    if (type) {
      this.type = type;
    }
    this.createPads();
    this.scene.get(LoopTracksScene.key).events.emit('track-selected');
  }

  private createPads() {
    // change the order of the pads if needed, top to bottom and left to right
    const pads: Pad[] = [
      // top
      this.createPad('crash'),
      this.createPad('ride'),
      this.createPad('hihat-open'),
      this.createPad('hihat'),
      // bottom
      this.createPad('snare'),
      this.createPad('tom-low'),
      this.createPad('tom-high'),
      this.createPad('kick'),
    ];

    const resizePads = () => {
      const isPortrait = window.innerWidth < window.innerHeight;
      const colNumber = isPortrait ? 2 : 4;
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

  private createPad(instrument: Sample): Pad {
    const padColor = padColors[instrument];
    const inactiveColor = hexToColor(padColor, this.type === 'drums');
    const hitColor = Phaser.Display.Color.HexStringToColor(padColor).brighten(4).color;
    const button = this.add.rectangle()
      .setFillStyle(inactiveColor)
      .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
      .setInteractive()
      .setOrigin(0, 0);
    button.on('pointerdown', (e: Phaser.Input.Pointer) => {
      if (e.downElement?.tagName?.toLowerCase() !== 'canvas') {
        return;
      }
      testNote();
      button.setFillStyle(hitColor);
      playSample(instrument);
      this.scene.get(LoopTracksScene.key).events.emit('instrument-played', {instrument, scene: this});
    }).on('pointerup', () => button.setFillStyle(inactiveColor))
      .on('pointerout', () => button.setFillStyle(inactiveColor));
    return {
      instrument,
      button
    };
  }
}

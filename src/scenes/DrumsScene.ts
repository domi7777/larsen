import {Colors, HexaColor, hexToColor, PhaserColors} from '../utils/colors.ts';
import {playSample, Sample} from '../samples/play-sample.ts';
import {PadsScene} from './PadsScene.ts';

const padColors: Record<Sample, HexaColor> = {
  hihat: Colors.orange,
  kick: Colors.red,
  snare: Colors.blue,
  crash: Colors.green,
  'hihat-open': Colors.yellow,
  ride: Colors.yellow2,
  'tom-low': Colors.orange2,
  'tom-high': Colors.purple,
  'tom-mid': Colors.pink,
};

// create same object but instead of instrument, name colors

export class DrumsScene extends PadsScene {

  private instruments: Sample[] = [
    // cymbals
    'crash',
    'crash',
    'ride',
    'hihat-open',
    'hihat',
    // drums
    'snare',
    'tom-high',
    'tom-mid',
    'tom-low',
    'kick',
  ]

  constructor() {
    // TODO make toms configurable
    /*
    {
    frequency: 300,    // Highest frequency
    decayTime: 0.3,   // Shortest decay
    pitchDecay: 0.1,  // Fast pitch decay
    frequencyDrop: 0.3 // Moderate frequency drop
  }
     */
    super(2, 5);
  }

  protected getPadColor(_numberOfPads: number, _index: number) {
    return PhaserColors.black;
  }

  protected getHitColor(_numberOfPads: number, index: number) {
    return hexToColor(padColors[this.instruments[index]]);
  }

  protected getPadText(index: number) {
    return { text: this.instruments[index], color: hexToColor(padColors[this.instruments[index]]) };
  }

  playSound(index: number): void {
    playSample(this.instruments[index]!, this.settings.volume);
  }
}

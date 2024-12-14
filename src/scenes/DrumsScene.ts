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
};

// create same object but instead of instrument, name colors

export class DrumsScene extends PadsScene {

  private instruments: Sample[] = [
    'crash',
    'ride',
    'hihat-open',
    'hihat',
    'snare',
    'tom-low',
    'tom-high',
    'kick',
  ]

  constructor() {
    super(2, 4);
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

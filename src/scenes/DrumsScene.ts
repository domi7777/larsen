import Phaser from 'phaser';
import {Colors, HexaColor, hexToColor} from '../utils/colors.ts';
import {playSample, Sample} from '../samples/play-sample.ts';
import {PadsScene} from './PadsScene.ts';

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
    return Phaser.Display.Color.IntegerToColor(hexToColor(Colors.black));
  }

  protected getPadText(index: number) {
    return { text: this.instruments[index], color: padColors[this.instruments[index]] };
  }

  playSound(index: number): void {
    playSample(this.instruments[index]!, this.settings.volume);
  }
}

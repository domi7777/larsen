import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../utils/colors.ts';
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

  protected getPadColor(_numberOfPads: number, index: number) {
    const padColor = hexToColor(padColors[this.instruments[index]]);
    return Phaser.Display.Color.IntegerToColor(padColor)
  }

  protected getPadText(index: number) {
    return this.instruments[index];
  }

  playSound(index: number): void {
    playSample(this.instruments[index]!, this.settings.volume);
  }
}

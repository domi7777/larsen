import {PadsScene, PadsSceneSettings, Setting} from './PadsScene.ts';
import {allFrequencies} from '../samples/synth-frequencies.ts';
import {createAudioContext} from '../samples/sample-utils.ts';
import Phaser from 'phaser';

const numberOfNotes = 12;
const maxNumberOfOctaves = 6;
const maxNumberOfPads = numberOfNotes * maxNumberOfOctaves;

export class SimpleSynthScene extends PadsScene {

  constructor() {
    super(maxNumberOfOctaves, numberOfNotes);
    this.settings.noteDuration = 1.5;
    this.settings.octaveRange = {
      min: 1,
      max: maxNumberOfOctaves,
    };
  }

  getPadText(index: number) {
    const note = allFrequencies[index];
    return note?.key;
  }

  getPadColor(_numberOfPads: number, index: number): Phaser.Display.Color {
    index += this.getNoteIndexOffset();
    const color = super.getPadColor(
      maxNumberOfPads,
      index
    );
    const key = allFrequencies[index]?.key;
    if (key?.includes('#')) {
      return color.darken(70);
    }
    return color.darken(50);
  }

  /**
   * when changing the range of the notes, we need to offset the index to get the correct note
   */
  protected getNoteIndexOffset() {
    return this.getLowerRangeIndex() * numberOfNotes;
  }

  protected getLowerRangeIndex() {
    return this.settings.octaveRange!.min - 1;
  }

  playSound(index: number): void {
    index += this.getNoteIndexOffset();
    const note = allFrequencies[index].freq;
    // play the sound
    return playPianoTone({
      frequency: note,
      ...this.settings
    });
  }

  onSettingChange(setting: Setting) {
    super.onSettingChange(setting);
    if (setting.octaveRange) {
      super.changePadNumber(setting.octaveRange.max + 1 - setting.octaveRange.min, 12);
    }
  }
}

const playPianoTone = ({ frequency, volume = 50, noteDuration = 1.5 }: { frequency: number } & PadsSceneSettings) => {
  const audioContext = createAudioContext();
  // Create an oscillator for the main tone
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine'; // Start with a sine wave as the base

  // Create a gain node to control volume (for the envelope)
  const gainNode = audioContext.createGain();

  // Set the oscillator frequency
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // Connect oscillator to gain and gain to output
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Define an envelope to mimic the piano attack and decay
  const attackTime = 0.02;  // Quick attack for a percussive sound

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);  // Start at zero
  gainNode.gain.linearRampToValueAtTime(volume / 100, audioContext.currentTime + attackTime); // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + noteDuration); // Decay

  // Start the oscillator and stop it after the decay
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + noteDuration * 2);
}

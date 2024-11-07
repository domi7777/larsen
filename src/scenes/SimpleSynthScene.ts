import {PadsScene} from './PadsScene.ts';
import {allFrequencies} from '../samples/synth-frequencies.ts';
import {createAudioContext} from '../samples/sample-utils.ts';
import Phaser from 'phaser';

export class SimpleSynthScene extends PadsScene {

  constructor() {
    super(6, 12);
  }

  create() {
    super.create();
  }

  getPadText(index: number) {
    const note = allFrequencies[index];
    return note?.key;
  }

  getPadColor(numberOfPads: number, index: number): Phaser.Display.Color {
    const color = super.getPadColor(numberOfPads, index);
    const key = allFrequencies[index]?.key;
    if (key?.includes('#')) {
      return color.darken(15);
    }
    return color;
  }

  playSound(index: number): void {
    const note = allFrequencies[index].freq;
    console.log('Playing note', note);
    // play the sound
    return playPianoTone(note);

    // const audioContext = createAudioContext();
    // const oscillator = audioContext.createOscillator();
    // oscillator.type = 'sine';
    // oscillator.frequency.setValueAtTime(note, audioContext.currentTime);
    // const gainNode = audioContext.createGain();
    // gainNode.gain.setValueAtTime(0.7, audioContext.currentTime); // Start loud
    // gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.0); // decay
    // oscillator.connect(gainNode);
    // gainNode.connect(audioContext.destination);
    // oscillator.start();
    // oscillator.stop(audioContext.currentTime + 1.5);
  }
}

const playPianoTone = (frequency: number) => {
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
  const decayTime = 1.5;    // Longer decay to simulate the piano fade out

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);  // Start at zero
  gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + attackTime); // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + decayTime); // Decay

  // Start the oscillator and stop it after the decay
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + decayTime);
}

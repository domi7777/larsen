import {PadsScene} from './PadsScene.ts';
import {allFrequencies} from '../samples/synth-frequencies.ts';
import {createAudioContext} from '../samples/sample-utils.ts';

export class SimpleSynthScene extends PadsScene {

  constructor() {
    super(8, 11);
  }

  create() {
    super.create();
  }

  playSound(index: number): void {
    const note = allFrequencies[index];
    console.log('Playing note', note);
    // play the sound
    const audioContext = createAudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note, audioContext.currentTime);
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Start loud
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5); // Long decay (1.5 seconds)
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.5);
  }
}

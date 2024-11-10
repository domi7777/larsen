import {allFrequencies} from '../samples/synth-frequencies.ts';
import {createAudioContext} from '../samples/sample-utils.ts';
import {logger} from '../utils/logger.ts';
import {SimpleSynthScene} from './SimpleSynthScene.ts';
import Phaser from 'phaser';

export class DaftSynthScene extends SimpleSynthScene {

  create() {
    super.create();
  }

  getPadColor(numberOfPads: number, index: number): Phaser.Display.Color {
    const padColor = super.getPadColor(numberOfPads, index);
    return padColor.saturate(50)
  }

  playSound(index: number): void {
    const note = allFrequencies[index].freq;
    logger.log('Playing note', note);
    return playDaftPunkSynth(note, this.settings.volume);
  }
}

function playDaftPunkSynth(frequency: number, volume: number) {
  // Create Audio Context
  const audioContext =createAudioContext();

  // Main oscillator for the core sound
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // Gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume / 100;

  // Low-pass filter to shape the sound (for a more "vintage" vibe)
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, audioContext.currentTime); // Cutoff frequency
  filter.Q.value = 1; // Resonance

  // Add some distortion for grit
  const distortion = audioContext.createWaveShaper();
  distortion.curve = makeDistortionCurve(400); // Amount of distortion
  distortion.oversample = '4x';

  // LFO for filter modulation (gives it a funky, wah-like sound)
  const lfo = audioContext.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(3, audioContext.currentTime); // Frequency of modulation (in Hz)

  // LFO gain control to adjust the modulation intensity
  const lfoGain = audioContext.createGain();
  lfoGain.gain.value = 200; // Adjust this for how much the filter moves

  // Connect the LFO to modulate the filter cutoff
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  // Connect nodes in the audio graph
  oscillator.connect(gainNode);
  gainNode.connect(filter);
  filter.connect(distortion);
  distortion.connect(audioContext.destination);

  // Start oscillators
  oscillator.start();
  lfo.start();

  // Stop the sound after 1 second for this demo
  oscillator.stop(audioContext.currentTime + 1);
  lfo.stop(audioContext.currentTime + 1);

  // Helper function to create distortion curve
  function makeDistortionCurve(amount: number) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}

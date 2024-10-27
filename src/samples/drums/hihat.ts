
// Improvements:
//     Shorter Noise Burst: The noise buffer duration is now much shorter (0.05 seconds), which results in a sharper, crisper hi-hat sound.
//     High-Pass Filter Tweaks: The cutoff frequency is set to 8000 Hz to eliminate more of the low-end and leave the high frequencies that give the hi-hat its metallic sound.
//     Resonance: Adding a slight resonance (Q = 1) to the high-pass filter emphasizes the higher frequencies and creates a sharper, more defined hi-hat.
//     Metallic Overtones: A very high-frequency square wave oscillator adds a metallic "shimmer" to the sound, blending with the noise.
//     Further Adjustments:
//     Decay: You can modify the decay time (currently 0.05 seconds for the noise and 0.03 for the oscillator) to make the hi-hat longer or shorter depending on whether you want a closed or open hi-hat.
//     Oscillator Volume: The oscillator (oscGain) is set at a low volume to subtly blend with the noise, creating a realistic metallic feel.
//

import {createAudioContext} from '../sample-utils.ts';

export function playHiHat() {
  const audioContext = createAudioContext();
  // --- 1. White Noise (for metallic hiss) ---
  const bufferSize = audioContext.sampleRate * 0.05; // Very short burst for a hi-hat
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1; // White noise
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  // High-pass filter to remove low frequencies and sharpen the sound
  const highPassFilter = audioContext.createBiquadFilter();
  highPassFilter.type = 'highpass';
  highPassFilter.frequency.setValueAtTime(8000, audioContext.currentTime); // High cutoff for a crisp sound
  highPassFilter.Q.setValueAtTime(1, audioContext.currentTime); // Slight resonance for metallic touch

  // Envelope to quickly fade out the noise
  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(1, audioContext.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05); // Fast decay for hi-hat sound

  noise.connect(highPassFilter);
  highPassFilter.connect(noiseGain);
  noiseGain.connect(audioContext.destination);

  noise.start();
  noise.stop(audioContext.currentTime + 0.05); // Short, sharp sound

  // --- 2. Additional metallic tone (optional, for a more "shimmering" hi-hat) ---
  const osc = audioContext.createOscillator();
  osc.type = 'square'; // Square wave for more metallic sound
  osc.frequency.setValueAtTime(10000, audioContext.currentTime); // Very high frequency for shimmer

  const oscGain = audioContext.createGain();
  oscGain.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume to blend with noise
  oscGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03); // Fast decay

  osc.connect(oscGain);
  oscGain.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 0.03); // Short burst for shimmer
}

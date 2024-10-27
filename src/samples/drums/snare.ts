// Breakdown:
//     White Noise:
//
//     Generates a burst of noise for the "rattle" effect of the snare wires.
//     A high-pass filter is applied to remove lower frequencies, leaving the sharper noise.
//     The noise fades out quickly using an envelope for a natural decay.
//     Low-Frequency Oscillator:
//
//     A sine wave oscillator creates the low-pitched "thump" of the drum body.
//     This sound also decays quickly using an envelope to mimic the drumhead vibration stopping.
//     Envelope Control:
//
//     Both the noise and oscillator have quick decay envelopes to simulate the natural sound of a snare hit.
import {createAudioContext} from '../sample-utils.ts';

export function playSnare() {
  const audioContext = createAudioContext();
  // --- 1. White Noise (for the snare wires) ---
  const bufferSize = audioContext.sampleRate * 0.2; // Duration: 0.2 seconds
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1; // White noise
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  // Apply a high-pass filter to the noise
  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(1000, audioContext.currentTime);

  // Envelope for the noise
  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(1, audioContext.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2); // Quick decay

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioContext.destination);

  noise.start();
  noise.stop(audioContext.currentTime + 0.2); // Short burst

  // --- 2. Low-Frequency Oscillator (for the drum body) ---
  const osc = audioContext.createOscillator();
  osc.type = 'sine'; // Sine wave for low-pitched tone
  osc.frequency.setValueAtTime(150, audioContext.currentTime); // Low frequency (150 Hz for a snare body)

  const oscGain = audioContext.createGain();
  oscGain.gain.setValueAtTime(0.7, audioContext.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Quick decay to mimic drum hit

  osc.connect(oscGain);
  oscGain.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 0.1); // Short, punchy tone
}

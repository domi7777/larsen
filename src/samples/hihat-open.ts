import {createAudioContext} from './sample-utils.ts';

export function playOpenHiHat() {
  const audioContext = createAudioContext();
  // --- 1. White Noise for the hi-hat ---
  const bufferSize = audioContext.sampleRate * 0.5; // 0.5 second buffer for longer open hi-hat
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1; // Generate white noise
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  // --- 2. High-pass filter to remove lower frequencies ---
  const highPassFilter = audioContext.createBiquadFilter();
  highPassFilter.type = 'highpass';
  highPassFilter.frequency.setValueAtTime(5000, audioContext.currentTime); // High cutoff for brightness

  // --- 3. Low-pass filter to shape the high-end frequencies ---
  const lowPassFilter = audioContext.createBiquadFilter();
  lowPassFilter.type = 'lowpass';
  lowPassFilter.frequency.setValueAtTime(10000, audioContext.currentTime); // Smooth out the very high frequencies

  // --- 4. Gain envelope for the sound decay ---
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.6, audioContext.currentTime); // Start at a moderate volume
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // Decay for a sustained open hi-hat sound

  // Connect the nodes together: noise -> highPass -> lowPass -> gain -> output
  noise.connect(highPassFilter);
  highPassFilter.connect(lowPassFilter);
  lowPassFilter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Play the noise
  noise.start();
  noise.stop(audioContext.currentTime + 0.5); // Stop after 0.5 seconds for an open hi-hat effect
}

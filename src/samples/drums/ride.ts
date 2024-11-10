import {createAudioContext} from '../sample-utils.ts';

export function playRide(volume = 80) {
  const audioContext = createAudioContext();
  // --- 1. White Noise for the metallic sound ---
  const bufferSize = audioContext.sampleRate * 1.2; // Slightly longer buffer for sustained ride sound
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1; // Generate white noise
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  // --- 2. High-pass filter to focus on high frequencies ---
  const highPassFilter = audioContext.createBiquadFilter();
  highPassFilter.type = 'highpass';
  highPassFilter.frequency.setValueAtTime(3000, audioContext.currentTime); // Lower frequency cutoff than hi-hat for more depth

  // --- 3. Low-pass filter to smooth out the harshness ---
  const lowPassFilter = audioContext.createBiquadFilter();
  lowPassFilter.type = 'lowpass';
  lowPassFilter.frequency.setValueAtTime(9000, audioContext.currentTime); // Tame the very high frequencies

  // --- 4. Gain envelope for the sound decay ---
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(volume / 100, audioContext.currentTime); // Start at a higher volume for prominence
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2); // Longer decay for a sustained ride sound

  // Connect the nodes: noise -> highPass -> lowPass -> gain -> output
  noise.connect(highPassFilter);
  highPassFilter.connect(lowPassFilter);
  lowPassFilter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Play the noise
  noise.start();
  noise.stop(audioContext.currentTime + 1.2); // Stop after 1.2 seconds for a ringing ride cymbal effect
}

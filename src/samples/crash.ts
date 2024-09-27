// Create an Audio Context
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//
// How It Works:
//     White Noise: The crash cymbal sound is built from a long burst of white noise (1.5 seconds) to capture the "wash" of the cymbal.
//     High-Pass Filter: We apply a high-pass filter with a high cutoff frequency (4000 Hz) to remove low-end noise and focus on the brighter, metallic part of the cymbal.
//     Low-Pass Filter: A low-pass filter at 12,000 Hz smooths out the very high frequencies, making the sound more pleasant and less harsh.
//     Gain Envelope: A long exponential decay simulates the ringing-out characteristic of a crash cymbal.
//     Metallic Overtones: A high-pitched oscillator (triangle wave) is added subtly to give the crash some metallic shimmer.
//     Customization:
// Decay Time: You can adjust the decay time (currently 1.5 seconds) for a longer or shorter crash cymbal.
//     Filter Frequencies: Adjusting the high-pass and low-pass filter frequencies will change how bright or dark the cymbal sounds.
//     Oscillator Volume: The metallic shimmer is controlled by oscGain.gain. You can increase or decrease it to blend the overtone more or less with the noise.
export function playCrashCymbal() {
  // --- 1. White Noise for the main crash sound ---
  const bufferSize = audioContext.sampleRate * 1.5; // 1.5 second buffer for long decay
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
  highPassFilter.frequency.setValueAtTime(4000, audioContext.currentTime); // High cutoff for cymbal brightness

  // --- 3. Low-pass filter to shape the high-end frequencies ---
  const lowPassFilter = audioContext.createBiquadFilter();
  lowPassFilter.type = 'lowpass';
  lowPassFilter.frequency.setValueAtTime(12000, audioContext.currentTime); // Smooth out harsh high frequencies

  // --- 4. Gain envelope to control the crash sound decay ---
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Start loud
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5); // Long decay (1.5 seconds)

  // Connect the nodes together: noise -> highPass -> lowPass -> gain -> output
  noise.connect(highPassFilter);
  highPassFilter.connect(lowPassFilter);
  lowPassFilter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Play the noise
  noise.start();
  noise.stop(audioContext.currentTime + 1.5); // Stop after 1.5 seconds

  // --- 5. Optional: Add metallic overtones using an oscillator ---
  const osc = audioContext.createOscillator();
  osc.type = 'triangle'; // Triangle wave for metallic shimmer
  osc.frequency.setValueAtTime(10000, audioContext.currentTime); // High frequency for shimmer effect

  const oscGain = audioContext.createGain();
  oscGain.gain.setValueAtTime(0.05, audioContext.currentTime); // Low volume to blend with noise
  oscGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5); // Decay along with noise

  // Connect oscillator for shimmer
  osc.connect(oscGain);
  oscGain.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 1.5); // Same duration as the noise
}

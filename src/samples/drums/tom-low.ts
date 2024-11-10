import {createAudioContext} from '../sample-utils.ts';

export function playTom1Low(hz = 99, durationInMs = 500, volume = 100) {
  const audioContext = createAudioContext();
  // --- 1. Create an oscillator for the base tone ---
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine'; // Use a sine wave for the base
  oscillator.frequency.setValueAtTime(hz, audioContext.currentTime); // Lower frequency for a deep tom sound

  // --- 2. Create a gain node for controlling volume ---
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(volume / 100, audioContext.currentTime); // Increase initial gain for louder sound
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // Quick decay

  // --- 3. Add a slight detuning effect to make the tom sound richer ---
  oscillator.detune.setValueAtTime(-5, audioContext.currentTime); // Small detuning for realism

  // --- 4. Connect nodes: oscillator -> gain -> output ---
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start the oscillator
  oscillator.start();

  // Stop after 0.5 seconds (length of the sound)
  oscillator.stop(audioContext.currentTime + (durationInMs / 1000));
}

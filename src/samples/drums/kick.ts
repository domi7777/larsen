import {createAudioContext} from '../sample-utils.ts';

export function playKick(volume = 100) {
  const context = createAudioContext();
  const time = context.currentTime;
  // Convert volume (0-100) to gain (0-1)
  // Using a logarithmic scale for more natural volume control
  const maxGain = Math.min(Math.max(volume, 0), 100) / 100;
  const gainValue = Math.pow(maxGain, 2); // Square it for more natural volume scaling

  // Create nodes
  const osc = context.createOscillator();
  const gain = context.createGain();

  // Set initial frequency
  osc.frequency.setValueAtTime(150, time);

  // Frequency envelope - sweep from 150 Hz down to nearly 0
  osc.frequency.exponentialRampToValueAtTime(
    0.01,
    time + 0.5
  );

  // Amplitude envelope
  gain.gain.setValueAtTime(gainValue, time);

  // Make the gain reach 0 slightly before the oscillator stops
  gain.gain.exponentialRampToValueAtTime(
    gainValue * 0.01,
    time + 0.48
  );
  gain.gain.linearRampToValueAtTime(
    0,
    time + 0.49
  );

  // Connect nodes
  osc.connect(gain);
  gain.connect(context.destination);

  // Start and stop the oscillator
  osc.start(time);
  osc.stop(time + 0.5);
}

import {createAudioContext} from '../sample-utils.ts';

export function playCowBell(volume = 100) {
  const context = createAudioContext();
  const time = context.currentTime;

  // Convert volume (0-100) to gain (0-1)
  const maxGain = Math.min(Math.max(volume, 0), 100) / 100;
  const gainValue = Math.pow(maxGain, 2);

  // Create nodes
  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();
  const gainNode = context.createGain();
  const bandpass = context.createBiquadFilter();

  // Set up bandpass filter for more metallic character
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(800, time);
  bandpass.Q.setValueAtTime(15, time);

  // Set frequencies for a more authentic cowbell sound
  osc1.frequency.setValueAtTime(680, time);  // Adjusted primary frequency
  osc2.frequency.setValueAtTime(1020, time); // Adjusted secondary frequency

  // Use square waves
  osc1.type = 'square';
  osc2.type = 'square';

  // Set initial gain
  gainNode.gain.setValueAtTime(0, time);

  // Very quick attack
  gainNode.gain.linearRampToValueAtTime(
    gainValue,
    time + 0.0005
  );

  // Much shorter decay
  gainNode.gain.exponentialRampToValueAtTime(
    gainValue * 0.1,
    time + 0.05
  );

  // Quick final decay
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    time + 0.1
  );

  // Final cleanup to zero
  gainNode.gain.linearRampToValueAtTime(
    0,
    time + 0.11
  );

  // Connect everything
  osc1.connect(bandpass);
  osc2.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(context.destination);

  // Start and stop
  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.11);
  osc2.stop(time + 0.11);
}

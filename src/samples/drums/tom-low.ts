import {createAudioContext} from '../sample-utils.ts';

const defaults = {
  frequency: 200,     // Starting frequency
  decayTime: 0.4,    // How long the sound lasts
  pitchDecay: 0.2,   // How quickly the pitch drops
};
export function triggerTom(volume = 50, settings = defaults) {
  const context = createAudioContext();
  const time = context.currentTime;
  // Convert volume (0-100) to gain (0-1)
  const maxGain = Math.min(Math.max(volume, 0), 100) / 100;
  const gainValue = Math.pow(maxGain, 2);

  // Create nodes
  const osc = context.createOscillator();
  const gain = context.createGain();

  // Set initial frequency
  osc.frequency.setValueAtTime(settings.frequency, time);

  // Frequency envelope - faster decay than kick
  osc.frequency.exponentialRampToValueAtTime(
    settings.frequency * 0.01,
    time + settings.pitchDecay
  );

  // Amplitude envelope
  gain.gain.setValueAtTime(gainValue, time);

  // Smoother decay for the tom sound
  gain.gain.exponentialRampToValueAtTime(
    gainValue * 0.01,
    time + settings.decayTime - 0.02
  );
  gain.gain.linearRampToValueAtTime(
    0,
    time + settings.decayTime
  );

  // Connect nodes
  osc.connect(gain);
  gain.connect(context.destination);

  // Start and stop the oscillator
  osc.start(time);
  osc.stop(time + settings.decayTime + 0.02);
}

export function playTom1Low(volume = 100) {
  triggerTom(volume, {
    frequency: 140,
    decayTime: 0.4,
    pitchDecay: 0.25
  });
}

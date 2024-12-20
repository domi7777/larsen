import {createAudioContext} from '../sample-utils.ts';

const defaults = {
  frequency: 200,     // Starting frequency
  decayTime: 0.4,    // How long the sound lasts
  pitchDecay: 0.2,   // How quickly the pitch drops
  frequencyDrop: 0.5 // How much the frequency drops (1 = all the way)
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

  // Frequency envelope - less extreme drop than kick
  const targetFreq = settings.frequency * (1 - settings.frequencyDrop);
  osc.frequency.exponentialRampToValueAtTime(
    Math.max(targetFreq, 0.01), // Ensure we don't go below 0.01
    time + settings.pitchDecay
  );

  // Amplitude envelope
  gain.gain.setValueAtTime(gainValue, time);

  // More pronounced initial attack for tom character
  gain.gain.linearRampToValueAtTime(
    gainValue * 0.7,
    time + 0.01
  );

  // Then decay
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

export function playLowTom(volume = 100) {
  triggerTom(volume,  {
    frequency: 180,    // Lowest frequency
    decayTime: 0.35,  // Longest decay
    pitchDecay: 0.15, // Slowest pitch decay
    frequencyDrop: 0.4 // Largest frequency drop
  });
}

export function playMidTom(volume = 100) {
  triggerTom(volume, {
    frequency: 225,    // Middle frequency
    decayTime: 0.33,  // Medium decay
    pitchDecay: 0.12, // Medium-fast pitch decay
    frequencyDrop: 0.35 // Medium frequency drop
  });
}

export function playHighTom(volume = 100) {
  triggerTom(volume, {
    frequency: 300,    // Highest frequency
    decayTime: 0.3,   // Shortest decay
    pitchDecay: 0.1,  // Fast pitch decay
    frequencyDrop: 0.3 // Moderate frequency drop
  });
}

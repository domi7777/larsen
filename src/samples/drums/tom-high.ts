import {triggerTom} from './tom-low.ts';

export function playTom2High(volume = 100) {
  triggerTom(volume, {
    frequency: 250,    // Higher frequency for high tom
    decayTime: 0.3,   // Shorter decay
    pitchDecay: 0.3,  // Fast pitch decay
    frequencyDrop: 0.9 // Moderate frequency drop
  });
}

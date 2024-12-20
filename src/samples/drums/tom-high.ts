import {triggerTom} from './tom-low.ts';

export function playTom2High(volume = 100) {
  triggerTom(volume, {
    frequency: 250,
    decayTime: 0.3,
    pitchDecay: 0.15
  });
}

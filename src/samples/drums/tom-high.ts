import {playTom1Low} from './tom-low.ts';

export function playTom2High(volume = 100) {
  playTom1Low(120, 400, volume);
}

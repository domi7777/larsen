import {logger} from '../utils/logger.ts';

let audioContext: AudioContext | null = null;
const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;

export const createAudioContext = () => {
  // reuse the existing AudioContext to avoid browser restriction when creating audio context in loop with no user interaction
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext?.state === 'suspended') {
    logger.log('Resuming AudioContext');
    audioContext?.resume();
  }
  return audioContext!;
}

export const resetAudioContext = () => {
  // audioContext = null;
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && audioContext?.state === 'suspended') {
    logger.log('Resuming AudioContext after visibility change');
    audioContext?.resume().catch((err) => logger.error('Error resuming AudioContext:', err));
  }
});

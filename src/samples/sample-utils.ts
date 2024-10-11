let audioContext: AudioContext | null = null;

export const createAudioContext = () => {
  // reuse the existing AudioContext to avoid browser restriction when creating audio context in loop with no user interaction
  if (!audioContext) {
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContext();
  }
  return audioContext!;
}

export const resetAudioContext = () => {
  audioContext = null;
}

export const createAudioContext = () => {
  const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
  return new AudioContext();
}

// Create an Audio Context
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

// How It Works:
//     Low-Frequency Oscillator: We start with a sine wave, which provides the smooth, deep bass characteristic of a kick drum.
//     Frequency Envelope: The frequency starts at 150 Hz (giving it an initial "punch") and quickly decays to 60 Hz, giving the typical bass drum "thump."
// Gain Envelope: The volume starts high and quickly decays over 0.5 seconds to simulate the fast attack and tail of a real kick drum.
//     Customization:
// Pitch: Adjust the initial frequency (150 Hz) or the final frequency (60 Hz) to create different kinds of kicks (e.g., higher for more punch, lower for deeper bass).
// Decay: The duration of the gain envelope can be adjusted to make the kick longer or shorter.

export function playKick() {
  // Create an oscillator for the low "thump"
  const osc = audioContext.createOscillator();
  osc.type = 'sine'; // Sine wave for a smooth, deep bass sound

  // Create a gain node to control the amplitude envelope
  const gainNode = audioContext.createGain();

  // Frequency (pitch) envelope: Start higher and quickly decay to a lower frequency
  osc.frequency.setValueAtTime(150, audioContext.currentTime); // Initial higher frequency for punch
  osc.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.1); // Drop to 60Hz

  // Gain envelope: Start loud and quickly decay
  gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Start loud
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // Decay to quiet over 0.5 seconds

  // Connect oscillator to gain, then to the audio context destination
  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start and stop the oscillator
  osc.start();
  osc.stop(audioContext.currentTime + 0.5); // Stop after 0.5 seconds (length of the kick)
}

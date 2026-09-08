let audioContext: AudioContext | null = null;

const MASTER_VOLUME = 0.5;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.1) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(volume * MASTER_VOLUME, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export const sounds = {
  insert: () => playTone(600, 0.15, "sine", 0.08),
  delete: () => playTone(300, 0.1, "square", 0.05),
  compare: () => playTone(800, 0.05, "sine", 0.04),
  swap: () => {
    playTone(500, 0.08, "sine", 0.06);
    setTimeout(() => playTone(600, 0.08, "sine", 0.06), 60);
  },
  success: () => {
    playTone(523, 0.1, "sine", 0.08);
    setTimeout(() => playTone(659, 0.1, "sine", 0.08), 100);
    setTimeout(() => playTone(784, 0.15, "sine", 0.08), 200);
  },
  error: () => {
    playTone(300, 0.15, "sawtooth", 0.05);
    setTimeout(() => playTone(250, 0.2, "sawtooth", 0.05), 150);
  },
  complete: () => {
    playTone(523, 0.1, "sine", 0.1);
    setTimeout(() => playTone(659, 0.1, "sine", 0.1), 120);
    setTimeout(() => playTone(784, 0.1, "sine", 0.1), 240);
    setTimeout(() => playTone(1047, 0.2, "sine", 0.1), 360);
  },
  click: () => playTone(1000, 0.03, "sine", 0.04),
};

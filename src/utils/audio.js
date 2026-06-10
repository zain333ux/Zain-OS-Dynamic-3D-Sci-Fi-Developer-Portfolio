// Web Audio API Procedural Synthesizer Service
let audioCtx = null;
let masterVolume = null;
let bootHumOsc = null;
let bootHumGain = null;

// Initialize Web Audio API safely on first user interaction
const initAudio = () => {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  audioCtx = new AudioContext();
  masterVolume = audioCtx.createGain();
  
  // Set default audio preference (defaults to true for immersive feel)
  const savedPref = localStorage.getItem('portfolio-audio');
  const enabled = savedPref === null ? true : savedPref === 'true';
  localStorage.setItem('portfolio-audio', enabled ? 'true' : 'false');
  
  // Increased master volume level (from 0.35 to 0.85 for high volume)
  masterVolume.gain.setValueAtTime(enabled ? 0.85 : 0, audioCtx.currentTime);
  masterVolume.connect(audioCtx.destination);
};

export const setAudioEnabled = (enabled) => {
  initAudio();
  localStorage.setItem('portfolio-audio', enabled ? 'true' : 'false');
  if (masterVolume && audioCtx) {
    masterVolume.gain.setValueAtTime(enabled ? 0.85 : 0, audioCtx.currentTime);
  }
};

export const getAudioEnabled = () => {
  initAudio();
  const pref = localStorage.getItem('portfolio-audio');
  return pref === 'true';
};

// Play mechanical terminal key typewriter click (increased volume to 0.12)
export const playClick = () => {
  initAudio();
  if (!audioCtx || getAudioEnabled() === false) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const time = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(550, time);
  osc.frequency.exponentialRampToValueAtTime(140, time + 0.045);

  gain.gain.setValueAtTime(0.12, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

  osc.connect(gain);
  gain.connect(masterVolume);

  osc.start(time);
  osc.stop(time + 0.045);
};

// Play deep 45Hz sub bass cinematic boot hum (increased volume target to 0.7)
export const playBootHum = () => {
  initAudio();
  if (!audioCtx || getAudioEnabled() === false) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const time = audioCtx.currentTime;

  bootHumOsc = audioCtx.createOscillator();
  bootHumGain = audioCtx.createGain();

  bootHumOsc.type = 'sawtooth';
  bootHumOsc.frequency.setValueAtTime(45, time);

  // Apply a low-pass filter to smooth the sawtooth into a deep cinematic rumble
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(110, time);

  bootHumGain.gain.setValueAtTime(0.001, time);
  bootHumGain.gain.linearRampToValueAtTime(0.7, time + 1.5); // Elevated volume sweep

  bootHumOsc.connect(filter);
  filter.connect(bootHumGain);
  bootHumGain.connect(masterVolume);

  bootHumOsc.start(time);
};

// Stop the boot hum smoothly with decay
export const stopBootHum = () => {
  if (!bootHumOsc || !bootHumGain || !audioCtx) return;
  const time = audioCtx.currentTime;
  
  bootHumGain.gain.setValueAtTime(bootHumGain.gain.value, time);
  bootHumGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

  const oscToStop = bootHumOsc;
  const gainToStop = bootHumGain;

  bootHumOsc = null;
  bootHumGain = null;

  setTimeout(() => {
    try {
      oscToStop.stop();
      oscToStop.disconnect();
      gainToStop.disconnect();
    } catch (e) {}
  }, 500);
};

// Play quick synthetic UI click/beep for hovers (increased volume to 0.06)
export const playHoverSound = () => {
  initAudio();
  if (!audioCtx || getAudioEnabled() === false) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const time = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(750, time);
  osc.frequency.exponentialRampToValueAtTime(1100, time + 0.07);

  gain.gain.setValueAtTime(0.06, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

  osc.connect(gain);
  gain.connect(masterVolume);

  osc.start(time);
  osc.stop(time + 0.08);
};

// Play extremely quick, soft mechanical click-wheel tick for scroll events (increased volume to 0.02)
export const playScrollTick = () => {
  initAudio();
  if (!audioCtx || getAudioEnabled() === false) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const time = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1450, time); // High pitch mechanical tick

  gain.gain.setValueAtTime(0.02, time); // Audibly clear but non-fatiguing
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.012); // Short decay (12ms)

  osc.connect(gain);
  gain.connect(masterVolume);

  osc.start(time);
  osc.stop(time + 0.015);
};

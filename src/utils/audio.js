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
  masterVolume.connect(audioCtx.destination);

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
  masterVolume.connect(audioCtx.destination);

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
  masterVolume.connect(audioCtx.destination);

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
  masterVolume.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + 0.015);
};

// State for dynamic scroll hum (Bandpass White Noise Wind)
let dynamicScrollHumSource = null;
let dynamicScrollHumFilter = null;
let dynamicScrollHumGain = null;
let dynamicScrollHumTimeout = null;
let scrollStartTimestamp = 0;
let noiseBuffer = null;

const getNoiseBuffer = () => {
  if (!audioCtx) return null;
  if (noiseBuffer) return noiseBuffer;
  const bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
  noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
};

// 1. Power-On Toggle [AUDIO: ON] (rising chime)
export const playPowerOnChirp = () => {
  initAudio();
  if (!audioCtx || getAudioEnabled() === false) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const time = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, time);
  osc.frequency.exponentialRampToValueAtTime(1800, time + 0.2);

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.12, time + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);

  osc.connect(gain);
  gain.connect(masterVolume);
  masterVolume.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + 0.21);
};

// 2. Data Sweep Swoosh for menu transitions (filtered white noise)
export const playDataSweepSwoosh = () => {
  initAudio();
  if (!audioCtx || getAudioEnabled() === false) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const time = audioCtx.currentTime;
  const duration = 0.45; // 450ms
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  // Populate white noise buffer
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(3.5, time);
  filter.frequency.setValueAtTime(3200, time);
  filter.frequency.exponentialRampToValueAtTime(550, time + duration);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.05, time + 0.05); // volume sweep
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  noiseNode.connect(filter);
  filter.connect(gain);
  gain.connect(masterVolume);
  masterVolume.connect(audioCtx.destination);

  noiseNode.start(time);
  noiseNode.stop(time + duration);
};

// 3. Card Interaction Sound 1: Hover relay tick
export const playMutedRelayTick = () => {
  initAudio();
  if (!audioCtx || getAudioEnabled() === false) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const time = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(2200, time); // High relay switch tick

  gain.gain.setValueAtTime(0.012, time); // Soft and muted
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.008);

  osc.connect(gain);
  gain.connect(masterVolume);
  masterVolume.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + 0.01);
};

// 4. Card Interaction Sound 2: Heavier analog double-tap click
export const playAnalogDoubleTapClick = () => {
  initAudio();
  if (!audioCtx || getAudioEnabled() === false) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const time = audioCtx.currentTime;

  // Tap 1: Lower frequency transient
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(180, time);
  osc1.frequency.exponentialRampToValueAtTime(60, time + 0.035);

  gain1.gain.setValueAtTime(0.18, time);
  gain1.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

  osc1.connect(gain1);
  gain1.connect(masterVolume);

  // Tap 2: Staggered second click (30ms offset)
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(130, time + 0.025);
  osc2.frequency.exponentialRampToValueAtTime(50, time + 0.065);

  gain2.gain.setValueAtTime(0.12, time + 0.025);
  gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.065);

  osc2.connect(gain2);
  gain2.connect(masterVolume);

  masterVolume.connect(audioCtx.destination);

  osc1.start(time);
  osc1.stop(time + 0.035);
  osc2.start(time + 0.025);
  osc2.stop(time + 0.065);
};

// 5. Scroll Telemetry Hum: Disabled completely per user request
export const startScrollHum = (speed) => {
  // No-op
};

const stopScrollHum = () => {
  // No-op
};

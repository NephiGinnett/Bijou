// ============================================================
// GATEBOUND — WebAudio synth sfx + generative ambient music.
// No audio assets; everything is synthesized.
// ============================================================

let ctx = null;
let master = null, musicGain = null, sfxGain = null;
let musicTimer = null, currentMode = null;
let settings = { volume: 0.6, music: true };

function ensureCtx() {
  if (ctx) return true;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = settings.volume;
    master.connect(ctx.destination);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.9;
    sfxGain.connect(master);
    musicGain = ctx.createGain();
    musicGain.gain.value = settings.music ? 0.32 : 0;
    musicGain.connect(master);
    return true;
  } catch (e) { return false; }
}

export function applySettings(s) {
  settings = { volume: s.volume ?? 0.6, music: s.music ?? true };
  if (master) master.gain.value = settings.volume;
  if (musicGain) musicGain.gain.value = settings.music ? 0.32 : 0;
}

export function unlock() {
  if (!ensureCtx()) return;
  if (ctx.state === 'suspended') ctx.resume();
}

function tone({ freq = 440, dur = 0.15, type = 'sine', vol = 0.5, slide = 0, delay = 0, dest = null }) {
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  o.connect(g); g.connect(dest || sfxGain);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

function noise({ dur = 0.2, vol = 0.4, freq = 800, q = 1, slide = -400, delay = 0 }) {
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const len = Math.max(1, ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass'; f.Q.value = q;
  f.frequency.setValueAtTime(freq, t0);
  if (slide) f.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(f); f.connect(g); g.connect(sfxGain);
  src.start(t0);
}

export function sfx(name) {
  if (!ensureCtx()) return;
  switch (name) {
    case 'ui':      tone({ freq: 720, dur: 0.06, type: 'triangle', vol: 0.25 }); break;
    case 'confirm': tone({ freq: 620, dur: 0.09, type: 'triangle', vol: 0.3 }); tone({ freq: 930, dur: 0.12, type: 'triangle', vol: 0.25, delay: 0.07 }); break;
    case 'hit':     noise({ dur: 0.16, vol: 0.5, freq: 900, slide: -600 }); tone({ freq: 180, dur: 0.12, type: 'square', vol: 0.18, slide: -80 }); break;
    case 'crit':    noise({ dur: 0.25, vol: 0.65, freq: 1400, slide: -900 }); tone({ freq: 140, dur: 0.22, type: 'sawtooth', vol: 0.3, slide: -60 }); break;
    case 'magic':   tone({ freq: 520, dur: 0.3, type: 'sine', vol: 0.3, slide: 500 }); tone({ freq: 780, dur: 0.25, type: 'triangle', vol: 0.2, slide: 300, delay: 0.08 }); break;
    case 'heal':    [523, 659, 784].forEach((f, i) => tone({ freq: f, dur: 0.28, type: 'sine', vol: 0.22, delay: i * 0.07 })); break;
    case 'shield':  tone({ freq: 300, dur: 0.3, type: 'triangle', vol: 0.3, slide: 160 }); break;
    case 'die':     noise({ dur: 0.4, vol: 0.4, freq: 400, slide: -320 }); tone({ freq: 200, dur: 0.45, type: 'sawtooth', vol: 0.16, slide: -150 }); break;
    case 'miss':    noise({ dur: 0.12, vol: 0.2, freq: 2000, slide: 800 }); break;
    case 'levelup': [392, 523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, dur: 0.22, type: 'triangle', vol: 0.3, delay: i * 0.09 })); break;
    case 'victory': [523, 523, 523, 659, 784].forEach((f, i) => tone({ freq: f, dur: i === 4 ? 0.5 : 0.14, type: 'triangle', vol: 0.3, delay: i * 0.13 })); break;
    case 'gate':    tone({ freq: 90, dur: 1.1, type: 'sine', vol: 0.5, slide: -40 }); noise({ dur: 0.9, vol: 0.25, freq: 300, slide: -200, q: 0.6 }); break;
    case 'coin':    tone({ freq: 1180, dur: 0.09, type: 'square', vol: 0.18 }); tone({ freq: 1570, dur: 0.16, type: 'square', vol: 0.14, delay: 0.06 }); break;
    case 'wipe':    [400, 350, 300, 240].forEach((f, i) => tone({ freq: f, dur: 0.4, type: 'sawtooth', vol: 0.18, delay: i * 0.25 })); break;
    case 'promo':   [523, 659, 784, 1046, 1318].forEach((f, i) => tone({ freq: f, dur: 0.3, type: 'sine', vol: 0.28, delay: i * 0.12 })); break;
  }
}

// --- generative ambient music -------------------------------------------

const SCALES = {
  title:   { root: 220.00, steps: [0, 3, 5, 7, 10, 12], pace: 1300, type: 'sine' },
  guild:   { root: 261.63, steps: [0, 4, 7, 9, 12, 14], pace: 1100, type: 'triangle' },
  dungeon: { root: 174.61, steps: [0, 3, 5, 6, 10, 12], pace: 1500, type: 'sine' },
  battle:  { root: 196.00, steps: [0, 3, 7, 10, 12, 15], pace: 700, type: 'triangle' },
};

let droneOscs = [];

export function music(mode) {
  if (!ensureCtx()) return;
  if (mode === currentMode) return;
  currentMode = mode;
  stopMusic(false);
  if (!mode) return;
  const sc = SCALES[mode] || SCALES.guild;

  // drones
  for (const mult of [1, 1.5]) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = sc.root / 2 * mult;
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    o.connect(g); g.connect(musicGain);
    o.start();
    droneOscs.push({ o, g });
  }
  // sparse arpeggio
  const step = () => {
    if (currentMode !== mode) return;
    if (Math.random() < 0.75) {
      const st = sc.steps[Math.floor(Math.random() * sc.steps.length)];
      const oct = Math.random() < 0.25 ? 2 : 1;
      tone({ freq: sc.root * Math.pow(2, st / 12) * oct, dur: 1.6, type: sc.type, vol: 0.05, dest: musicGain });
    }
    musicTimer = setTimeout(step, sc.pace * (0.7 + Math.random() * 0.6));
  };
  step();
}

export function stopMusic(clearMode = true) {
  if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
  for (const { o, g } of droneOscs) {
    try {
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      o.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  }
  droneOscs = [];
  if (clearMode) currentMode = null;
}

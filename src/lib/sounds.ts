/**
 * Tiny sound effects using Web Audio API — no audio files needed.
 * Each sound is a short synthesized tone/noise.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

/** Short cheerful "tick" for completing a quest */
export function playTick() {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  o.frequency.setValueAtTime(880, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(1320, c.currentTime + 0.08);
  g.gain.setValueAtTime(0.15, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
  o.start(c.currentTime);
  o.stop(c.currentTime + 0.15);
}

/** Un-tick: lower pitch descending tone */
export function playUntick() {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  o.frequency.setValueAtTime(660, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.1);
  g.gain.setValueAtTime(0.1, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
  o.start(c.currentTime);
  o.stop(c.currentTime + 0.12);
}

/** Celebratory chime for block completion / unlock */
export function playChime() {
  const c = getCtx();
  if (!c) return;
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "triangle";
    o.connect(g);
    g.connect(c.destination);
    const t = c.currentTime + i * 0.1;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.start(t);
    o.stop(t + 0.3);
  });
}

/** Big celebration fanfare for science unlock / level complete */
export function playFanfare() {
  const c = getCtx();
  if (!c) return;
  const melody = [
    { f: 523, t: 0 },    // C5
    { f: 659, t: 0.12 },  // E5
    { f: 784, t: 0.24 },  // G5
    { f: 1047, t: 0.4 },  // C6
    { f: 1047, t: 0.55 }, // C6 (repeat)
  ];
  melody.forEach(({ f, t }) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "triangle";
    o.connect(g);
    g.connect(c.destination);
    const start = c.currentTime + t;
    o.frequency.setValueAtTime(f, start);
    g.gain.setValueAtTime(0.15, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
    o.start(start);
    o.stop(start + 0.25);
  });
}

/** Short "coin" ding for earning a point */
export function playCoin() {
  const c = getCtx();
  if (!c) return;
  const notes = [1047, 1319]; // C6 E6 — quick two-note ding
  notes.forEach((freq, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "triangle";
    o.connect(g);
    g.connect(c.destination);
    const t = c.currentTime + i * 0.08;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.13, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.start(t);
    o.stop(t + 0.18);
  });
}

/** Playful "spend" sound — descending two-note chime */
export function playSpend() {
  const c = getCtx();
  if (!c) return;
  const notes = [784, 523]; // G5 C5 — descending
  notes.forEach((freq, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "triangle";
    o.connect(g);
    g.connect(c.destination);
    const t = c.currentTime + i * 0.1;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.start(t);
    o.stop(t + 0.2);
  });
}

/** Soft low tone for sleep ceremony breathing */
export function playSoftTone(freq = 220) {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.connect(g);
  g.connect(c.destination);
  o.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(0.06, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);
  o.start(c.currentTime);
  o.stop(c.currentTime + 1.5);
}

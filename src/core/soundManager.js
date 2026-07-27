// ============================================================
// src/core/soundManager.js — Web Audio API Sound Engine
// Generates all sounds programmatically. Zero audio files needed.
// Respects user's sound preference from SaveManager.
// ============================================================

import SaveManager from './saveManager.js';
import EventBus from './eventBus.js';

let _ctx = null;
let _enabled = false;

function _getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
}

function _tone({ frequency = 440, type = 'sine', duration = 0.1, gain = 0.15, attack = 0.01, decay = 0.05 }) {
  if (!_enabled) return;
  try {
    const ctx = _getCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - decay);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* silent fail — audio not supported */ }
}

const SoundManager = {
  init() {
    _enabled = SaveManager.get('sound');
    // Listen for toggle events
    EventBus.on('sound:toggle', ({ on }) => {
      _enabled = on;
      SaveManager.set('sound', on);
    });
  },

  isEnabled() { return _enabled; },

  /** Achievement unlocked — pleasant high ding */
  ding() {
    _tone({ frequency: 880, type: 'sine', duration: 0.35, gain: 0.12, attack: 0.01, decay: 0.1 });
    setTimeout(() => _tone({ frequency: 1320, type: 'sine', duration: 0.25, gain: 0.08 }), 120);
  },

  /** Tech collected in snake — satisfying pop */
  pop() {
    _tone({ frequency: 660, type: 'triangle', duration: 0.1, gain: 0.2, attack: 0.005, decay: 0.04 });
  },

  /** Snake dies — descending beep */
  beep() {
    _tone({ frequency: 330, type: 'sawtooth', duration: 0.4, gain: 0.08, attack: 0.01, decay: 0.15 });
    setTimeout(() => _tone({ frequency: 220, type: 'sawtooth', duration: 0.3, gain: 0.06 }), 200);
  },

  /** UI button click — tiny click */
  click() {
    _tone({ frequency: 600, type: 'square', duration: 0.04, gain: 0.06, attack: 0.002, decay: 0.02 });
  },

  /** Level up — rising arpeggio */
  levelUp() {
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => _tone({ frequency: freq, type: 'sine', duration: 0.2, gain: 0.15, attack: 0.01, decay: 0.08 }), i * 100);
    });
  },

  /** Debug correct answer */
  correct() {
    _tone({ frequency: 523, type: 'sine', duration: 0.15, gain: 0.12 });
    setTimeout(() => _tone({ frequency: 659, type: 'sine', duration: 0.2, gain: 0.1 }), 100);
  },

  /** Debug wrong answer */
  wrong() {
    _tone({ frequency: 200, type: 'sawtooth', duration: 0.3, gain: 0.1, attack: 0.01, decay: 0.15 });
  },
};

export default SoundManager;

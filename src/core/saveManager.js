// ============================================================
// src/core/saveManager.js — Versioned localStorage
// All persistence goes through here. Never call localStorage directly.
// ============================================================

import { CONFIG } from '../config/app.js';

const KEY = CONFIG.saveKey; // 'portfolio-v1'

const DEFAULT_STATE = {
  version: CONFIG.version,
  xp: 0,
  level: 1,
  mode: 'classic',
  sound: CONFIG.sound.defaultOn,
  achievements: [],
  analytics: {},
  snake: { highScore: 0, collected: [], gamesPlayed: 0 },
  debug: { streak: 0, totalSolved: 0, totalAttempts: 0 },
  world: { visited: [], totalEnters: 0 },
  github: { logoClicks: 0 },
};

const SaveManager = {
  _state: null,

  /**
   * Load state from localStorage. Creates default if missing or outdated.
   */
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        this._state = structuredClone(DEFAULT_STATE);
        this._persist();
        return;
      }
      const parsed = JSON.parse(raw);
      // Version migration: merge with defaults to fill new keys
      this._state = { ...structuredClone(DEFAULT_STATE), ...parsed };
      // Deep merge nested objects
      for (const key of ['snake', 'debug', 'world', 'analytics', 'github']) {
        this._state[key] = { ...DEFAULT_STATE[key], ...(parsed[key] || {}) };
      }
    } catch {
      this._state = structuredClone(DEFAULT_STATE);
      this._persist();
    }
  },

  /** Save current state to localStorage. */
  save() { this._persist(); },

  /** Reset to factory defaults. */
  reset() {
    this._state = structuredClone(DEFAULT_STATE);
    this._persist();
  },

  /** Get a top-level key or the full state. */
  get(key) {
    if (!this._state) this.load();
    return key ? this._state[key] : structuredClone(this._state);
  },

  /** Set a top-level key and persist. */
  set(key, value) {
    if (!this._state) this.load();
    this._state[key] = value;
    this._persist();
  },

  /** Merge into a nested object key. */
  merge(key, partial) {
    if (!this._state) this.load();
    this._state[key] = { ...this._state[key], ...partial };
    this._persist();
  },

  _persist() {
    try { localStorage.setItem(KEY, JSON.stringify(this._state)); }
    catch (e) { console.warn('[SaveManager] Could not persist state:', e); }
  },
};

// Auto-load on import
SaveManager.load();

export default SaveManager;

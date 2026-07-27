// ============================================================
// src/core/portfolioManager.js — Application Controller
// The single source of runtime state. All modules talk through
// EventBus; PortfolioManager reacts and coordinates.
// ============================================================

import { CONFIG } from '../config/app.js';
import EventBus from './eventBus.js';
import SaveManager from './saveManager.js';
import SoundManager from './soundManager.js';

const PortfolioManager = {
  _games: {},      // registered game plugins keyed by id
  _githubClicks: 0,

  init() {
    SoundManager.init();

    // Listen for XP additions
    EventBus.on('xp:add', ({ amount }) => this.addXP(amount));

    // Listen for achievement unlock requests
    EventBus.on('achievement:unlock', ({ id }) => this.unlock(id));

    // Listen for mode change requests
    EventBus.on('mode:change', ({ mode }) => this.setMode(mode));

    // GitHub easter egg counter
    EventBus.on('github:click', () => {
      this._githubClicks++;
      SaveManager.merge('github', { logoClicks: this._githubClicks });
      if (this._githubClicks >= 5) {
        this.unlock('open_source');
        this._githubClicks = 0;
      }
    });

    // Challenge Me — pick a random game
    EventBus.on('challenge:random', () => this._launchRandom());

    // Apply saved mode on load
    const savedMode = SaveManager.get('mode');
    if (savedMode === 'interactive') {
      this._applyMode('interactive', false); // false = don't re-save
    }
  },

  // ── XP & Levels ─────────────────────────────────────────

  addXP(amount) {
    const current = SaveManager.get('xp');
    const currentLevel = SaveManager.get('level');
    const newXP = current + amount;
    SaveManager.set('xp', newXP);

    // Check for level-up
    const newLevel = this._calcLevel(newXP);
    if (newLevel > currentLevel) {
      SaveManager.set('level', newLevel);
      const levelData = CONFIG.xpLevels[newLevel - 1];
      EventBus.emit('xp:levelup', { level: newLevel, title: levelData.title, icon: levelData.icon });
      SoundManager.levelUp();
    }

    EventBus.emit('hud:update', this.getState());
  },

  _calcLevel(xp) {
    let level = 1;
    for (const l of CONFIG.xpLevels) {
      if (xp >= l.xp) level = l.level;
    }
    return level;
  },

  // ── Achievements ─────────────────────────────────────────

  unlock(id) {
    const unlocked = SaveManager.get('achievements') || [];
    if (unlocked.includes(id)) return; // already unlocked

    const def = CONFIG.achievements.find(a => a.id === id);
    if (!def) return;

    unlocked.push(id);
    SaveManager.set('achievements', unlocked);

    // Award XP
    this.addXP(def.xp);

    // Fire toast
    EventBus.emit('toast:show', {
      type: 'achievement',
      icon: def.icon,
      title: `Achievement Unlocked`,
      message: def.title,
      sub: `+${def.xp} XP`,
    });

    SoundManager.ding();
    EventBus.emit('progress:update', this.getState());
  },

  // ── Mode ─────────────────────────────────────────────────

  setMode(mode) {
    this._applyMode(mode, true);
  },

  async _applyMode(mode, persist = true) {
    document.body.setAttribute('data-mode', mode);
    if (persist) SaveManager.set('mode', mode);

    if (mode === 'interactive' && CONFIG.features.debugChallenge) {
      await this._lazyLoad();
    }

    EventBus.emit('hud:update', this.getState());
  },

  async _lazyLoad() {
    const loads = [];
    if (CONFIG.features.debugChallenge) {
      loads.push(import('../games/debugChallenge.js').then(m => {
        this.registerGame(m.default);
        m.default.init();
      }).catch(() => {}));
    }
    if (CONFIG.features.snake) {
      loads.push(import('../games/techSnake.js').then(m => {
        this.registerGame(m.default);
        m.default.init();
      }).catch(() => {}));
    }
    await Promise.all(loads);
  },

  // ── Game Plugin Registry ──────────────────────────────────

  registerGame(plugin) {
    if (!plugin?.id) return;
    this._games[plugin.id] = plugin;
  },

  getGame(id) { return this._games[id] || null; },

  // ── State ─────────────────────────────────────────────────

  getState() {
    const xp = SaveManager.get('xp');
    const level = SaveManager.get('level');
    const levelData = CONFIG.xpLevels[level - 1];
    const nextLevelData = CONFIG.xpLevels[level] || null;
    return {
      xp,
      level,
      levelTitle: levelData?.title,
      levelIcon:  levelData?.icon,
      nextXP:     nextLevelData?.xp || null,
      mode:       SaveManager.get('mode'),
      sound:      SaveManager.get('sound'),
      achievements: SaveManager.get('achievements') || [],
      totalAchievements: CONFIG.achievements.length,
    };
  },

  // ── Challenge Me ─────────────────────────────────────────

  _launchRandom() {
    const mode = SaveManager.get('mode');
    if (mode !== 'interactive') {
      this.setMode('interactive');
    }
    const options = ['debug', 'snake', 'world'];
    const pick = options[Math.floor(Math.random() * options.length)];
    if (pick === 'world') {
      window.location.href = 'world.html';
    } else {
      const el = document.getElementById(pick === 'debug' ? 'debug-challenge' : 'tech-snake');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    EventBus.emit('analytics:track', { key: 'challenge_me_clicked' });
  },
};

export default PortfolioManager;

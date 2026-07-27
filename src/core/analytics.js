// ============================================================
// src/core/analytics.js — Privacy-Safe Interaction Analytics
// Tracks counts and aggregates locally. Zero network calls.
// No PII, no timestamps, no user IDs.
// ============================================================

import SaveManager from './saveManager.js';
import EventBus from './eventBus.js';
import { CONFIG } from '../config/app.js';

const Analytics = {
  init() {
    // Wire up EventBus listeners for automatic tracking
    EventBus.on('analytics:track', ({ key }) => this.track(key));
    EventBus.on('world:enter', ({ building }) => {
      if (building === 'sonexa_lab') this.track('sonexa_viewed');
      this.track('world_visited');
    });
    EventBus.on('snake:death', () => this.track('snake_played'));
    EventBus.on('debug:correct', () => this._updateDebugAvg());
    EventBus.on('resume:download', () => this.track('resume_downloaded'));
  },

  /** Increment a counter by key. */
  track(key) {
    if (!CONFIG.features.analytics) return;
    const analytics = SaveManager.get('analytics') || {};
    analytics[key] = (analytics[key] || 0) + 1;
    SaveManager.set('analytics', analytics);
  },

  /** Get all analytics data. */
  getAll() {
    return SaveManager.get('analytics') || {};
  },

  /** Get aggregates (scores, derived metrics). */
  getAggregates() {
    const debug = SaveManager.get('debug');
    const snake = SaveManager.get('snake');
    const analytics = this.getAll();

    // Derive most-viewed project
    const projectKeys = ['sonexa_viewed', 'sign2sound_viewed', 'mapping_viewed'];
    const favorite = projectKeys.reduce((a, b) =>
      (analytics[a] || 0) > (analytics[b] || 0) ? a : b, projectKeys[0]
    ).replace('_viewed', '');

    return {
      debugAvgScore:   debug.totalAttempts > 0
                         ? (debug.totalSolved / debug.totalAttempts * 100).toFixed(1) + '%'
                         : 'N/A',
      snakeHighScore:  snake.highScore,
      favoriteProject: favorite,
      totalSessions:   analytics.terminal_used || 0,
    };
  },

  /** Formatted summary string for terminal command. */
  getSummary() {
    const data = this.getAll();
    const agg = this.getAggregates();
    const lines = [
      '── Interaction Analytics ──────────────────',
      ...CONFIG.analyticsKeys.map(k => `  ${k.padEnd(28)} ${data[k] || 0}`),
      '── Aggregates ─────────────────────────────',
      `  debug_accuracy              ${agg.debugAvgScore}`,
      `  snake_high_score            ${agg.snakeHighScore}`,
      `  favorite_project            ${agg.favoriteProject}`,
    ];
    return lines.join('<br>');
  },

  _updateDebugAvg() {
    const debug = SaveManager.get('debug');
    SaveManager.merge('debug', {
      totalSolved: (debug.totalSolved || 0) + 1,
      totalAttempts: (debug.totalAttempts || 0) + 1,
    });
  },
};

export default Analytics;

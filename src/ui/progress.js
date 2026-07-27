// ============================================================
// src/ui/progress.js — Explorer Progress Panel
// Shows achievement count, XP bar, and level in the
// #achievements section. Always visible in both modes.
// ============================================================

import EventBus from '../core/eventBus.js';
import { CONFIG } from '../config/app.js';
import SaveManager from '../core/saveManager.js';

let _el = null;

function _render(state) {
  if (!_el) return;
  const { xp, level, levelIcon, levelTitle, nextXP, achievements, totalAchievements } = state;
  const pct = nextXP ? Math.min(Math.round((xp / nextXP) * 100), 100) : 100;
  const filledBlocks = Math.round(pct / 10);
  const bar = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks);

  _el.innerHTML = `
    <div class="progress-panel" aria-label="Explorer progress">
      <div class="progress-header">
        <span class="progress-label">Explorer Progress</span>
        <span class="progress-achievements">${achievements.length} / ${totalAchievements} Achievements</span>
      </div>
      <div class="progress-bar-text" aria-label="XP bar: ${pct}%">${bar}</div>
      <div class="progress-level">
        ${levelIcon} Level ${level} · <strong>${levelTitle}</strong>
        · ${xp} XP${nextXP ? ` / ${nextXP} for next level` : ' · Max Level!'}
      </div>
      <div class="progress-achievements-list">
        ${_renderAchievements(achievements)}
      </div>
    </div>
  `;
}

function _renderAchievements(unlocked) {
  return CONFIG.achievements.map(a => `
    <div class="progress-achievement ${unlocked.includes(a.id) ? 'unlocked' : 'locked'}"
         title="${a.desc}" aria-label="${a.title}: ${unlocked.includes(a.id) ? 'unlocked' : 'locked'}">
      <span class="ach-icon">${unlocked.includes(a.id) ? a.icon : '🔒'}</span>
      <span class="ach-name">${a.title}</span>
      ${unlocked.includes(a.id) ? `<span class="ach-xp">+${a.xp} XP</span>` : ''}
    </div>
  `).join('');
}

const Progress = {
  init() {
    _el = document.getElementById('explorer-progress');
    if (!_el) return;

    EventBus.on('progress:update', (state) => _render(state));
    EventBus.on('hud:update', (state) => _render(state));
  },

  render(state) { _render(state); },
};

export default Progress;

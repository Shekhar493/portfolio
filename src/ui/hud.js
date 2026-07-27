// ============================================================
// src/ui/hud.js — XP / Level HUD Overlay
// Fixed top-right, visible only in Interactive Mode.
// Updates on xp:add and mode:change events.
// ============================================================

import EventBus from '../core/eventBus.js';
import { CONFIG } from '../config/app.js';

let _el = null;

function _render(state) {
  if (!_el) return;
  const { xp = 0, level = 1, levelIcon = '⚡', levelTitle = 'Code Explorer', nextXP = 100 } = state || {};
  const progress = nextXP ? Math.min((xp / nextXP) * 100, 100) : 100;

  _el.innerHTML = `
    <div class="hud-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div class="hud-level" style="display: flex; align-items: center; gap: 0.35rem; font-weight: 700; color: #fff; font-family: var(--font-heading);">
        <span class="hud-icon">${levelIcon}</span>
        <span class="hud-level-num" style="color: var(--primary-color);">Lv.${level}</span>
      </div>
      <div class="hud-title" style="color: #cbd5e1; font-size: 0.75rem; font-family: var(--font-code);">${levelTitle}</div>
    </div>
    <div class="hud-xp-bar" role="progressbar" aria-valuenow="${xp}" aria-valuemin="0" aria-valuemax="${nextXP || xp}" aria-label="XP progress" style="height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin: 0.25rem 0 0.15rem 0;">
      <div class="hud-xp-fill" style="width:${progress}%; height: 100%; background: var(--primary-color); transition: width 0.4s ease;"></div>
    </div>
    <div class="hud-xp-text" style="color: #94a3b8; font-size: 0.72rem; text-align: right; font-family: var(--font-code);">${xp} XP${nextXP ? ` / ${nextXP}` : ' · Max Level!'}</div>
  `;
}

const HUD = {
  init() {
    _el = document.getElementById('xp-hud');
    if (!_el) {
      _el = document.createElement('div');
      _el.id = 'xp-hud';
      _el.setAttribute('aria-label', 'XP and level progress');
      document.body.appendChild(_el);
    }
    _el.classList.add('hud-visible');

    EventBus.on('hud:update', (state) => {
      _render(state);
      _el.classList.add('hud-visible');
    });

    EventBus.on('mode:change', () => {
      _el.classList.add('hud-visible');
    });
  },

  update(state) {
    _render(state);
  },
};

export default HUD;

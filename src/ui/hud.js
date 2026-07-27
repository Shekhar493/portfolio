// ============================================================
// src/ui/hud.js — XP / Level HUD Card
// Fixed to the top-right corner, below the navbar.
// Never overlaps the navbar or page content.
// ============================================================

import EventBus from '../core/eventBus.js';

let _el = null;

function _render(state) {
  if (!_el) return;
  const { xp = 0, level = 1, levelIcon = '👨‍💻', levelTitle = 'Code Explorer', nextXP = 100 } = state || {};
  const progress = nextXP ? Math.min((xp / nextXP) * 100, 100) : 100;

  _el.innerHTML = `
    <div class="hud-row">
      <span class="hud-icon">${levelIcon}</span>
      <span class="hud-level-num">Lv.${level}</span>
      <span class="hud-title-text">${levelTitle}</span>
    </div>
    <div class="hud-xp-bar" role="progressbar" aria-valuenow="${xp}" aria-valuemin="0" aria-valuemax="${nextXP || xp}" aria-label="XP progress">
      <div class="hud-xp-fill" style="width:${progress}%"></div>
    </div>
    <div class="hud-xp-text">${xp} / ${nextXP || '∞'} XP</div>
  `;
}

const HUD = {
  init() {
    // Always append to body as a fixed corner card — never inside navbar
    _el = document.getElementById('xp-hud');
    if (!_el) {
      _el = document.createElement('div');
      _el.id = 'xp-hud';
      _el.setAttribute('aria-label', 'XP and level progress');
      document.body.appendChild(_el);
    }

    // Make sure it is a direct child of body, not navbar
    if (_el.parentElement !== document.body) {
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

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
  const { xp, level, levelIcon, levelTitle, nextXP } = state;
  const progress = nextXP ? Math.min((xp / nextXP) * 100, 100) : 100;

  _el.innerHTML = `
    <div class="hud-level">
      <span class="hud-icon">${levelIcon}</span>
      <span class="hud-level-num">Lv.${level}</span>
    </div>
    <div class="hud-title">${levelTitle}</div>
    <div class="hud-xp-bar" role="progressbar" aria-valuenow="${xp}" aria-valuemin="0" aria-valuemax="${nextXP || xp}" aria-label="XP progress">
      <div class="hud-xp-fill" style="width:${progress}%"></div>
    </div>
    <div class="hud-xp-text">${xp} XP${nextXP ? ` / ${nextXP}` : ' · Max Level!'}</div>
  `;
}

const HUD = {
  init() {
    // Create element
    _el = document.createElement('div');
    _el.id = 'xp-hud';
    _el.setAttribute('aria-label', 'XP and level progress');
    document.body.appendChild(_el);

    // Listen for updates
    EventBus.on('hud:update', (state) => {
      _render(state);
      const mode = document.body.getAttribute('data-mode');
      _el.classList.toggle('hud-visible', mode === 'interactive');
    });

    // Listen for mode change
    EventBus.on('mode:change', ({ mode }) => {
      _el.classList.toggle('hud-visible', mode === 'interactive');
    });
  },

  update(state) {
    _render(state);
  },
};

export default HUD;

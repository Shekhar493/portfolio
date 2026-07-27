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
    <div class="hud-level">
      <span class="hud-icon">${levelIcon}</span>
      <span class="hud-level-num">Lv.${level}</span>
    </div>
    <div class="hud-xp-bar" role="progressbar" aria-valuenow="${xp}" aria-valuemin="0" aria-valuemax="${nextXP || xp}" aria-label="XP progress">
      <div class="hud-xp-fill" style="width:${progress}%"></div>
    </div>
    <div class="hud-xp-text">${xp}${nextXP ? `/${nextXP}` : ''} XP</div>
  `;
  _el.title = `Level ${level}: ${levelTitle} (${xp}${nextXP ? ` / ${nextXP}` : ''} XP)`;
}

const HUD = {
  init() {
    _el = document.getElementById('xp-hud');
    if (!_el) {
      _el = document.createElement('div');
      _el.id = 'xp-hud';
      _el.setAttribute('aria-label', 'XP and level progress');

      const navActions = document.querySelector('.nav-actions');
      if (navActions) {
        navActions.insertBefore(_el, navActions.firstChild);
      } else {
        document.body.appendChild(_el);
      }
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

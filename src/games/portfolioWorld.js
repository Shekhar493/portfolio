// ============================================================
// src/games/portfolioWorld.js — Portfolio World Page Script
// Plugin interface & HTML/CSS Grid World navigation.
// WASD / Arrow keys or click to move player and enter buildings.
// ============================================================

import EventBus from '../core/eventBus.js';
import SaveManager from '../core/saveManager.js';
import SoundManager from '../core/soundManager.js';
import PortfolioManager from '../core/portfolioManager.js';
import { CONFIG } from '../config/app.js';

let _buildings = CONFIG.worldBuildings;
let _visited = [];
let _activeBuilding = null;

const PortfolioWorld = {
  id: 'portfolio-world',
  title: 'Portfolio World',
  state: 'idle',

  init() {
    const saved = SaveManager.get('world');
    _visited = (saved && saved.visited) ? saved.visited : [];
    this._renderGrid();
    this._bindEvents();

    // Check achievement if all visited
    this._checkAllVisited();
  },

  _renderGrid() {
    const gridEl = document.getElementById('world-grid');
    if (!gridEl) return;

    gridEl.innerHTML = _buildings.map(b => `
      <div class="world-building ${b.id} ${_visited.includes(b.id) ? 'visited' : ''}"
           data-id="${b.id}"
           style="--building-color: ${b.color}"
           role="button"
           tabindex="0"
           aria-label="${b.name}: ${b.content.subtitle}">
        <div class="building-badge">${_visited.includes(b.id) ? '✓ Visited' : 'Explore'}</div>
        <div class="building-icon">${b.icon}</div>
        <h3 class="building-name">${b.name}</h3>
        <p class="building-sub">${b.content.subtitle}</p>
      </div>
    `).join('');
  },

  _bindEvents() {
    const gridEl = document.getElementById('world-grid');
    if (!gridEl) return;

    gridEl.addEventListener('click', (e) => {
      const card = e.target.closest('.world-building');
      if (card) {
        this.enterBuilding(card.dataset.id);
      }
    });

    gridEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.world-building');
        if (card) {
          e.preventDefault();
          this.enterBuilding(card.dataset.id);
        }
      }
    });

    // Close modal
    const closeBtn = document.getElementById('world-modal-close');
    const backdrop = document.getElementById('world-modal-backdrop');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeBuilding());
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeBuilding();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeBuilding();
    });

    // Hidden duck click listener
    const duck = document.getElementById('world-hidden-duck');
    if (duck) {
      duck.addEventListener('click', () => {
        EventBus.emit('achievement:unlock', { id: 'curious_explorer' });
      });
    }
  },

  enterBuilding(id) {
    const b = _buildings.find(x => x.id === id);
    if (!b) return;

    _activeBuilding = b;
    SoundManager.click();

    if (!_visited.includes(id)) {
      _visited.push(id);
      SaveManager.merge('world', { visited: _visited });
      this._renderGrid();
    }

    if (b.achievement) {
      EventBus.emit('achievement:unlock', { id: b.achievement });
    }

    this._checkAllVisited();

    EventBus.emit('world:enter', { building: id });

    // Open Modal
    const backdrop = document.getElementById('world-modal-backdrop');
    const body = document.getElementById('world-modal-body');
    if (!backdrop || !body) return;

    body.innerHTML = `
      <div class="building-modal-header" style="border-left: 4px solid ${b.color}; padding-left: 1rem;">
        <span class="modal-building-icon">${b.icon}</span>
        <h2>${b.name}</h2>
        <p style="color: #94a3b8; font-size: 0.95rem;">${b.content.subtitle}</p>
      </div>
      <div class="building-modal-desc" style="margin: 1.5rem 0; color: #cbd5e1; line-height: 1.6;">
        ${b.content.description}
      </div>
      ${b.content.tech.length ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Technologies</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${b.content.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
        ${b.content.github ? `<a href="${b.content.github}" target="_blank" class="btn btn-primary"><i class="fab fa-github"></i> View GitHub Repo</a>` : ''}
        ${b.content.download ? `<a href="#" id="world-resume-download-btn" class="btn btn-primary"><i class="fas fa-download"></i> Download Resume</a>` : ''}
        ${b.content.links ? `
          <a href="${b.content.links.email}" class="btn btn-secondary"><i class="fas fa-envelope"></i> Email Me</a>
          <a href="${b.content.links.github}" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> GitHub</a>
          <a href="${b.content.links.linkedin}" target="_blank" class="btn btn-secondary"><i class="fab fa-linkedin"></i> LinkedIn</a>
        ` : ''}
      </div>
    `;

    backdrop.style.display = 'flex';

    // Handle resume download click
    const dlBtn = document.getElementById('world-resume-download-btn');
    if (dlBtn) {
      dlBtn.addEventListener('click', (e) => {
        e.preventDefault();
        EventBus.emit('achievement:unlock', { id: 'resume_download' });
        EventBus.emit('resume:download');
        EventBus.emit('toast:show', {
          type: 'info',
          icon: '📄',
          title: 'Resume Request',
          message: 'Resume download initiated!',
        });
      });
    }
  },

  closeBuilding() {
    const backdrop = document.getElementById('world-modal-backdrop');
    if (backdrop) backdrop.style.display = 'none';
    _activeBuilding = null;
  },

  _checkAllVisited() {
    if (_visited.length >= _buildings.length) {
      EventBus.emit('achievement:unlock', { id: 'all_buildings' });
    }
  },
};

export default PortfolioWorld;

// Auto init if on world page
if (typeof window !== 'undefined' && window.location.pathname.includes('world.html')) {
  document.addEventListener('DOMContentLoaded', () => PortfolioWorld.init());
}

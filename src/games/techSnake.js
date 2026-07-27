// ============================================================
// src/games/techSnake.js — Tech Snake Game
// Plugin interface: { id, title, state, init, destroy, pause, resume, reset }
// FSM: idle → starting → playing → paused → game_over → idle
// Collectibles: 20 technologies. Each shows a popup with projects.
// ============================================================

import EventBus from '../core/eventBus.js';
import SaveManager from '../core/saveManager.js';
import SoundManager from '../core/soundManager.js';
import { CONFIG } from '../config/app.js';

const { gridSize, cellPx, speed } = CONFIG.snake;
const CANVAS_SIZE = gridSize * cellPx;

let _canvas, _ctx, _intervalId;
let _snake, _dir, _nextDir, _food, _score, _collectedTechs;
let _state = 'idle';
let _allTechs = CONFIG.snakeTechs;
let _popupTimeout = null;

// ── Game Helpers ───────────────────────────────────────────

function _rand(max) { return Math.floor(Math.random() * max); }

function _newGame() {
  const mid = Math.floor(gridSize / 2);
  _snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  _dir = { x: 1, y: 0 };
  _nextDir = { x: 1, y: 0 };
  _score = 0;
  _collectedTechs = SaveManager.get('snake')?.collected || [];
  _placeFoodFromUncollected();
}

function _placeFoodFromUncollected() {
  const uncollected = _allTechs.filter(t => !_collectedTechs.includes(t.name));
  const pool = uncollected.length ? uncollected : _allTechs;
  const tech = pool[_rand(pool.length)];

  let pos;
  let attempts = 0;
  do {
    pos = { x: _rand(gridSize), y: _rand(gridSize) };
    attempts++;
  } while (_snake && _snake.some(s => s.x === pos.x && s.y === pos.y) && attempts < 100);

  _food = { ...pos, tech };
}

function _tick() {
  if (_state !== 'playing') return;
  _dir = { ..._nextDir };

  const head = { x: _snake[0].x + _dir.x, y: _snake[0].y + _dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return _endGame();
  }
  // Self collision
  if (_snake.some(s => s.x === head.x && s.y === head.y)) {
    return _endGame();
  }

  _snake.unshift(head);

  if (_food && head.x === _food.x && head.y === _food.y) {
    // Eat food
    _score += 10 + (_food.tech?.tier || 1) * 5;
    SoundManager.pop();
    if (_food.tech) _showTechPopup(_food.tech);

    if (_food.tech && !_collectedTechs.includes(_food.tech.name)) {
      _collectedTechs.push(_food.tech.name);
      SaveManager.merge('snake', { collected: _collectedTechs });
    }

    if (_food.tech) {
      EventBus.emit('snake:collect', { tech: _food.tech.name });
      EventBus.emit('xp:add', { amount: (_food.tech.tier || 1) * 5, source: 'snake' });
    }

    // Check full-stack achievement
    if (_collectedTechs.length >= _allTechs.length) {
      EventBus.emit('achievement:unlock', { id: 'full_stack_explorer' });
    }

    // Score achievement
    if (_score >= 50) EventBus.emit('achievement:unlock', { id: 'snake_score_50' });

    _updateScoreDisplay();
    _updateProgressSidebar();
    _placeFoodFromUncollected();
  } else {
    _snake.pop();
  }

  _draw();
}

function _endGame() {
  clearInterval(_intervalId);
  _state = 'game_over';
  SoundManager.beep();

  const saved = SaveManager.get('snake') || {};
  if (_score > (saved.highScore || 0)) {
    SaveManager.merge('snake', { highScore: _score, gamesPlayed: (saved.gamesPlayed || 0) + 1 });
  } else {
    SaveManager.merge('snake', { gamesPlayed: (saved.gamesPlayed || 0) + 1 });
  }

  EventBus.emit('snake:death', { score: _score });

  _draw();
  _drawOverlay('Game Over', `Score: ${_score} · High: ${SaveManager.get('snake')?.highScore || 0}`, 'Press ▶ Play or R to Restart');
}

// ── Drawing ────────────────────────────────────────────────

function _draw() {
  if (!_ctx) return;
  _ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Background grid dots
  _ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      _ctx.fillRect(x * cellPx + cellPx / 2 - 1, y * cellPx + cellPx / 2 - 1, 2, 2);
    }
  }

  // Food
  if (_food && _food.tech) {
    _ctx.font = `${cellPx - 4}px serif`;
    _ctx.textAlign = 'center';
    _ctx.textBaseline = 'middle';
    _ctx.fillText(_food.tech.icon, _food.x * cellPx + cellPx / 2, _food.y * cellPx + cellPx / 2);
  }

  // Snake body
  if (_snake) {
    _snake.forEach((seg, i) => {
      const progress = 1 - i / _snake.length;
      _ctx.fillStyle = i === 0 ? '#6366f1' : `rgba(99, 102, 241, ${0.4 + progress * 0.5})`;
      _ctx.beginPath();
      _ctx.roundRect(
        seg.x * cellPx + 2, seg.y * cellPx + 2,
        cellPx - 4, cellPx - 4, 4
      );
      _ctx.fill();
    });
  }

  // Draw overlay if idle
  if (_state === 'idle') {
    _drawOverlay('Tech Snake', 'Collect 20 technologies to unlock skills & XP', 'Click ▶ Play or Press Space to Start');
  } else if (_state === 'paused') {
    _drawOverlay('Paused', `Score: ${_score}`, 'Click ▶ Resume or Press Space');
  }
}

function _drawOverlay(title, subtitle, action) {
  if (!_ctx) return;
  _ctx.save();
  _ctx.fillStyle = 'rgba(9, 13, 22, 0.85)';
  _ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  _ctx.fillStyle = '#ffffff';
  _ctx.font = 'bold 22px Outfit, sans-serif';
  _ctx.textAlign = 'center';
  _ctx.textBaseline = 'middle';
  _ctx.fillText(title, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 25);

  _ctx.font = '13px Inter, sans-serif';
  _ctx.fillStyle = '#94a3b8';
  _ctx.fillText(subtitle, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 5);

  _ctx.font = 'bold 12px Fira Code, monospace';
  _ctx.fillStyle = '#6366f1';
  _ctx.fillText(action, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 35);
  _ctx.restore();
}

// ── UI Helpers ─────────────────────────────────────────────

function _updateScoreDisplay() {
  const el = document.getElementById('snake-score');
  if (el) el.textContent = `Score: ${_score}`;
  const hi = document.getElementById('snake-highscore');
  if (hi) hi.textContent = `Best: ${SaveManager.get('snake')?.highScore || 0}`;
}

function _updateProgressSidebar() {
  const list = document.getElementById('snake-tech-list');
  if (!list) return;
  const collected = _collectedTechs || [];
  list.innerHTML = CONFIG.snakeTechs.map(t => `
    <div class="snake-tech-item ${collected.includes(t.name) ? 'collected' : ''}">
      <span>${t.icon}</span>
      <span class="snake-tech-name">${t.name}</span>
      ${collected.includes(t.name) ? '<span class="snake-check">✓</span>' : ''}
    </div>
  `).join('');
}

function _showTechPopup(tech) {
  const popup = document.getElementById('snake-popup');
  if (!popup) return;
  clearTimeout(_popupTimeout);
  popup.innerHTML = `
    <div class="snake-popup-icon">${tech.icon}</div>
    <div class="snake-popup-name">${tech.name}</div>
    <div class="snake-popup-projects">
      ${tech.projects.map(p => `<span>✓ ${p}</span>`).join('')}
    </div>
  `;
  popup.classList.add('snake-popup-show');
  _popupTimeout = setTimeout(() => popup.classList.remove('snake-popup-show'), 2800);
}

function _bindKeys() {
  const map = {
    ArrowUp:    { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
    ArrowDown:  { x: 0, y: 1 },  s: { x: 0, y: 1 },  S: { x: 0, y: 1 },
    ArrowLeft:  { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },  d: { x: 1, y: 0 },  D: { x: 1, y: 0 },
  };

  document.addEventListener('keydown', (e) => {
    // Prevent arrow key scrolling when snake section is visible or playing
    const snakeSection = document.getElementById('tech-snake');
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (_state === 'playing') {
        e.preventDefault();
      }
    }

    if (e.key === ' ' && _state !== 'idle' && _state !== 'game_over') {
      e.preventDefault();
      if (_state === 'playing') TechSnake.pause();
      else if (_state === 'paused') TechSnake.resume();
      return;
    }

    if ((e.key === 'r' || e.key === 'R') && (_state === 'game_over' || _state === 'paused' || _state === 'idle')) {
      TechSnake.reset();
      TechSnake.resume();
      return;
    }

    if (_state !== 'playing') return;

    const newDir = map[e.key];
    if (newDir) {
      if (newDir.x !== -_dir.x || newDir.y !== -_dir.y) {
        _nextDir = newDir;
      }
    }
  });
}

// ── Plugin Interface ────────────────────────────────────────

const TechSnake = {
  id: 'tech-snake',
  title: 'Tech Snake',
  state: 'idle',

  init() {
    _canvas = document.getElementById('snake-canvas');
    if (!_canvas) return;

    _canvas.width = CANVAS_SIZE;
    _canvas.height = CANVAS_SIZE;
    _ctx = _canvas.getContext('2d');
    _canvas.setAttribute('aria-label', 'Tech Snake game canvas');
    _canvas.setAttribute('role', 'application');
    _canvas.style.cursor = 'pointer';

    _newGame();
    _bindKeys();
    _updateProgressSidebar();
    _updateScoreDisplay();
    _draw();

    // Click canvas to play/pause
    _canvas.addEventListener('click', () => {
      if (_state === 'idle' || _state === 'game_over') {
        this.reset();
        this.resume();
      } else if (_state === 'playing') {
        this.pause();
      } else if (_state === 'paused') {
        this.resume();
      }
    });

    // Play button
    document.getElementById('snake-play-btn')?.addEventListener('click', () => {
      if (_state === 'idle' || _state === 'game_over') {
        this.reset();
        this.resume();
      } else if (_state === 'playing') {
        this.pause();
      } else if (_state === 'paused') {
        this.resume();
      }
      SoundManager.click();
      EventBus.emit('analytics:track', { key: 'snake_played' });
    });

    document.getElementById('snake-restart-btn')?.addEventListener('click', () => {
      this.reset();
      this.resume();
      SoundManager.click();
    });
  },

  destroy() { clearInterval(_intervalId); },

  pause() {
    clearInterval(_intervalId);
    _state = 'paused';
    const btn = document.getElementById('snake-play-btn');
    if (btn) btn.textContent = '▶ Resume';
    _draw();
  },

  resume() {
    if (_state === 'idle' || _state === 'game_over') _newGame();
    _state = 'playing';
    clearInterval(_intervalId);
    _intervalId = setInterval(_tick, speed);
    const btn = document.getElementById('snake-play-btn');
    if (btn) btn.textContent = '⏸ Pause';
    _draw();
  },

  reset() {
    clearInterval(_intervalId);
    _state = 'idle';
    _newGame();
    _updateScoreDisplay();
    _draw();
    const btn = document.getElementById('snake-play-btn');
    if (btn) btn.textContent = '▶ Play';
  },
};

export default TechSnake;

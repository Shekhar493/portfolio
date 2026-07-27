// ============================================================
// src/ui/toast.js — Slide-In Toast Notification System
// Handles regular toasts and achievement toasts.
// Slides in from bottom-right, auto-dismisses after 3s.
// ============================================================

import EventBus from '../core/eventBus.js';
import { CONFIG } from '../config/app.js';

let _container = null;

function _ensureContainer() {
  if (_container) return _container;
  _container = document.createElement('div');
  _container.id = 'toast-system';
  _container.setAttribute('aria-live', 'polite');
  _container.setAttribute('aria-atomic', 'false');
  document.body.appendChild(_container);
  return _container;
}

function _createToast({ type = 'info', icon = 'ℹ️', title = '', message = '', sub = '' }) {
  const el = document.createElement('div');
  el.className = `toast-item toast-${type}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
      ${sub ? `<div class="toast-sub">${sub}</div>` : ''}
    </div>
    <button class="toast-close" aria-label="Dismiss notification">✕</button>
  `;

  el.querySelector('.toast-close').addEventListener('click', () => _dismiss(el));
  return el;
}

function _dismiss(el) {
  el.classList.add('toast-exit');
  setTimeout(() => el.remove(), 350);
}

const Toast = {
  init() {
    _ensureContainer();
    EventBus.on('toast:show', (opts) => this.show(opts));
    EventBus.on('xp:levelup', ({ level, title, icon }) => {
      this.show({
        type: 'levelup',
        icon,
        title: `Level Up! You're now Level ${level}`,
        message: title,
        sub: '🎉 Keep exploring!',
      });
    });
  },

  show(opts) {
    const container = _ensureContainer();
    const el = _createToast(opts);
    container.appendChild(el);

    // Trigger enter animation on next frame
    requestAnimationFrame(() => el.classList.add('toast-enter'));

    // Auto-dismiss
    const timer = setTimeout(() => _dismiss(el), CONFIG.toast.durationMs);
    el.addEventListener('mouseenter', () => clearTimeout(timer));
    el.addEventListener('mouseleave', () => setTimeout(() => _dismiss(el), 1000));
  },

  info(message, title = 'Info') {
    this.show({ type: 'info', icon: 'ℹ️', title, message });
  },

  success(message, title = 'Done') {
    this.show({ type: 'success', icon: '✅', title, message });
  },

  error(message, title = 'Error') {
    this.show({ type: 'error', icon: '❌', title, message });
  },
};

export default Toast;

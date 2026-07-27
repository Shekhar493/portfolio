// ============================================================
// src/core/eventBus.js — Pub/Sub Event Bus
// Decouples all modules. No direct cross-module calls.
// ============================================================

const EventBus = {
  _listeners: {},

  /**
   * Subscribe to an event.
   * @param {string} event
   * @param {Function} fn
   */
  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
    return () => this.off(event, fn); // returns unsubscribe function
  },

  /**
   * Unsubscribe from an event.
   * @param {string} event
   * @param {Function} fn
   */
  off(event, fn) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(f => f !== fn);
  },

  /**
   * Emit an event with optional data.
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(fn => {
      try { fn(data); }
      catch (e) { console.error(`[EventBus] Error in listener for "${event}":`, e); }
    });
  },

  /**
   * Subscribe once — auto-unsubscribes after first call.
   * @param {string} event
   * @param {Function} fn
   */
  once(event, fn) {
    const wrapper = (data) => { fn(data); this.off(event, wrapper); };
    this.on(event, wrapper);
  },
};

export default EventBus;

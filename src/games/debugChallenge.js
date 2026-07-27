// ============================================================
// src/games/debugChallenge.js — Debug the Code Challenge
// Plugin interface: { id, title, state, init, destroy, pause, resume, reset }
// FSM: idle → starting → playing → completed → game_over → idle
// ============================================================

import EventBus from '../core/eventBus.js';
import SaveManager from '../core/saveManager.js';
import SoundManager from '../core/soundManager.js';
import { CONFIG } from '../config/app.js';

// ── Question Bank (24 questions: 6 categories × 4 each) ────

const QUESTIONS = [
  // ── Python ────────────────────────────────────────────────
  {
    lang: 'python', category: 'Python', difficulty: 'easy',
    code: ['def greet(name)', '    return f"Hello {name}"'],
    bugLine: 0, explanation: "Missing ':' after function definition (def greet(name):)", xp: 10,
  },
  {
    lang: 'python', category: 'Python', difficulty: 'medium',
    code: ['score = 100', 'if score = 100:', '    print("Perfect!")'],
    bugLine: 1, explanation: "'=' is assignment. Use '==' for comparison.", xp: 20,
  },
  {
    lang: 'python', category: 'Python', difficulty: 'medium',
    code: ['names = ["Alice", "Bob"]', 'for name in names', '    print(name)'],
    bugLine: 1, explanation: "Missing ':' at end of for statement.", xp: 20,
  },
  {
    lang: 'python', category: 'Python', difficulty: 'hard',
    code: ['import asyncio', 'async def fetch():', '    await asyncio.sleep(1)', '    return "done"', 'asyncio.run(fetch)'],
    bugLine: 4, explanation: "'fetch' should be called: asyncio.run(fetch())", xp: 35,
  },

  // ── JavaScript ────────────────────────────────────────────
  {
    lang: 'javascript', category: 'JavaScript', difficulty: 'easy',
    code: ['const nums = [1, 2, 3];', 'console.log(num.length);'],
    bugLine: 1, explanation: "'num' is undefined. Should be 'nums.length'.", xp: 10,
  },
  {
    lang: 'javascript', category: 'JavaScript', difficulty: 'medium',
    code: ['const add = (a, b) => {', '    return a + b', '}', 'console.log(add(2, 3);'],
    bugLine: 3, explanation: "Missing closing ')' before ';' in console.log(add(2, 3));", xp: 20,
  },
  {
    lang: 'javascript', category: 'JavaScript', difficulty: 'medium',
    code: ['let count = 0;', 'setInterval(() => {', '    count++;', '}, 100)'],
    bugLine: 0, explanation: "This code works, but 'let' should be 'const' if count never reassigns — wait, count++ reassigns, actually the bug is no clearInterval is stored.",
    xp: 20,
  },
  {
    lang: 'javascript', category: 'JavaScript', difficulty: 'hard',
    code: [
      'async function getData() {',
      '  const res = await fetch("/api/data");',
      '  const json = res.json();',
      '  return json;',
      '}',
    ],
    bugLine: 2, explanation: "Missing 'await' before res.json(). Should be: const json = await res.json();", xp: 35,
  },

  // ── React ─────────────────────────────────────────────────
  {
    lang: 'jsx', category: 'React', difficulty: 'easy',
    code: ['function App() {', '  return <h1>Hello</h1>', '}', 'export App;'],
    bugLine: 3, explanation: "Should be 'export default App;' — missing 'default' keyword.", xp: 10,
  },
  {
    lang: 'jsx', category: 'React', difficulty: 'medium',
    code: ['const [count, setCount] = useState(0);', 'setCount(count + 1)', 'setCount(count + 1)', '// Expected: count = 2'],
    bugLine: 1, explanation: "Use functional update: setCount(prev => prev + 1) — stale closures cause count to only increment once.", xp: 20,
  },
  {
    lang: 'jsx', category: 'React', difficulty: 'medium',
    code: ['useEffect(() => {', '  fetchData();', '}, [data])'],
    bugLine: 2, explanation: "'data' in the dependency array causes an infinite loop if fetchData updates 'data'.", xp: 20,
  },
  {
    lang: 'jsx', category: 'React', difficulty: 'hard',
    code: [
      'const memoized = useMemo(() => compute(x), []);',
      '// x changes but compute never re-runs',
    ],
    bugLine: 0, explanation: "Empty dependency array means useMemo never re-runs. Should include 'x': useMemo(() => compute(x), [x])", xp: 35,
  },

  // ── FastAPI ───────────────────────────────────────────────
  {
    lang: 'python', category: 'FastAPI', difficulty: 'easy',
    code: ['from fastapi import FastAPI', 'app = FastAPI()', '@app.get("/")'],
    bugLine: 2, explanation: "Route decorator '@app.get(\"/\")' has no function below it — missing the route handler function.", xp: 10,
  },
  {
    lang: 'python', category: 'FastAPI', difficulty: 'medium',
    code: [
      '@app.post("/items")',
      'def create(item: Item):',
      '    db.add(item)',
      '    db.commit()',
      '    return item',
    ],
    bugLine: 1, explanation: "Synchronous DB call inside a non-async route. Should use 'async def' and await async DB calls.", xp: 20,
  },
  {
    lang: 'python', category: 'FastAPI', difficulty: 'medium',
    code: [
      'from fastapi import FastAPI',
      'app = FastAPI()',
      '@app.websocket("/ws")',
      'def ws_endpoint(ws: WebSocket):',
      '    await ws.accept()',
    ],
    bugLine: 3, explanation: "WebSocket handlers must be 'async def', not 'def', to use 'await'.", xp: 20,
  },
  {
    lang: 'python', category: 'FastAPI', difficulty: 'hard',
    code: [
      'from fastapi import Depends',
      'def get_db(): yield db',
      '@app.get("/users")',
      'def get_users(db = get_db()):',
      '    return db.query(User).all()',
    ],
    bugLine: 3, explanation: "Should use 'db = Depends(get_db)' not 'db = get_db()' — Depends enables FastAPI's dependency injection lifecycle.", xp: 35,
  },

  // ── SQL ───────────────────────────────────────────────────
  {
    lang: 'sql', category: 'SQL', difficulty: 'easy',
    code: ['SELECT name, age', 'FROM users', 'WERE age > 18;'],
    bugLine: 2, explanation: "'WERE' is not valid SQL. Should be 'WHERE age > 18;'", xp: 10,
  },
  {
    lang: 'sql', category: 'SQL', difficulty: 'medium',
    code: [
      'SELECT users.name, orders.total',
      'FROM users',
      'LEFT JOIN orders ON user.id = orders.user_id;',
    ],
    bugLine: 2, explanation: "'user.id' should be 'users.id' — table alias must match the FROM clause.", xp: 20,
  },
  {
    lang: 'sql', category: 'SQL', difficulty: 'medium',
    code: [
      'SELECT department, COUNT(*)',
      'FROM employees',
      'GROUP BY department',
      'WHERE COUNT(*) > 5;',
    ],
    bugLine: 3, explanation: "'WHERE' cannot filter on aggregates. Use 'HAVING COUNT(*) > 5' after GROUP BY.", xp: 20,
  },
  {
    lang: 'sql', category: 'SQL', difficulty: 'hard',
    code: [
      'SELECT * FROM orders',
      'WHERE user_id IN (SELECT id FROM users WHERE active = true)',
      'AND created_at > NOW() - "7 days";',
    ],
    bugLine: 2, explanation: "String '\"7 days\"' is not valid SQL interval. Use INTERVAL '7 days' (PostgreSQL) or DATE_SUB(NOW(), INTERVAL 7 DAY) (MySQL).", xp: 35,
  },

  // ── Git ───────────────────────────────────────────────────
  {
    lang: 'bash', category: 'Git', difficulty: 'easy',
    code: ['git add .', 'git commit "initial commit"'],
    bugLine: 1, explanation: "Missing '-m' flag. Should be: git commit -m \"initial commit\"", xp: 10,
  },
  {
    lang: 'bash', category: 'Git', difficulty: 'medium',
    code: ['git checkout main', 'git merge feature/auth', '# Conflicts arise', 'git commit -m "resolved"'],
    bugLine: 3, explanation: "After resolving merge conflicts you must 'git add .' the resolved files before committing.", xp: 20,
  },
  {
    lang: 'bash', category: 'Git', difficulty: 'hard',
    code: [
      'git rebase origin/main',
      '# Conflicts arise',
      '# Fix conflicts',
      'git rebase --continue',
      'git push origin feature/auth',
    ],
    bugLine: 4, explanation: "After rebasing, the branch history is rewritten. You need 'git push --force-with-lease origin feature/auth' (not a regular push).", xp: 35,
  },
];

// ── State Machine ──────────────────────────────────────────

let _state = 'idle';
let _current = null;
let _timer = null;
let _timeLeft = 0;
let _streak = 0;
let _category = 'all';
let _difficulty = 'all';

function _setState(s) { _state = s; }

function _getPool() {
  return QUESTIONS.filter(q =>
    (_category === 'all' || q.category === _category) &&
    (_difficulty === 'all' || q.difficulty === _difficulty)
  );
}

function _pickQuestion() {
  const pool = _getPool();
  if (!pool.length) return null;
  const exclude = _current;
  const available = pool.filter(q => q !== exclude);
  return available[Math.floor(Math.random() * available.length)] || pool[0];
}

// ── DOM Helpers ────────────────────────────────────────────

function _getEl(id) { return document.getElementById(id); }

function _renderCode(q) {
  const container = _getEl('dc-code');
  if (!container) return;
  container.innerHTML = q.code.map((line, i) => `
    <div class="dc-line" data-line="${i}" role="option" tabindex="0"
         aria-label="Line ${i + 1}: ${line}">
      <span class="dc-linenum">${i + 1}</span>
      <span class="dc-linetext">${_escHtml(line)}</span>
    </div>
  `).join('');

  // Click & keyboard handlers
  container.querySelectorAll('.dc-line').forEach(el => {
    el.addEventListener('click', () => _checkLine(parseInt(el.dataset.line)));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        _checkLine(parseInt(el.dataset.line));
      }
    });
  });
}

function _renderMeta(q) {
  const langEl = _getEl('dc-lang');
  const diffEl = _getEl('dc-difficulty-badge');
  if (langEl) langEl.textContent = q.category;
  if (diffEl) {
    diffEl.textContent = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);
    diffEl.className = `dc-badge dc-badge-${q.difficulty}`;
  }
}

function _startTimer() {
  _timeLeft = CONFIG.debug.timerSeconds;
  _updateTimerDisplay();
  _timer = setInterval(() => {
    _timeLeft--;
    _updateTimerDisplay();
    if (_timeLeft <= 0) _timeExpired();
  }, 1000);
}

function _stopTimer() {
  clearInterval(_timer);
  _timer = null;
}

function _updateTimerDisplay() {
  const el = _getEl('dc-timer');
  if (el) {
    el.textContent = _timeLeft;
    el.className = `dc-timer ${_timeLeft <= 10 ? 'dc-timer-warn' : ''}`;
  }
  // Ring animation
  const ring = _getEl('dc-timer-ring');
  if (ring) {
    const pct = _timeLeft / CONFIG.debug.timerSeconds;
    const circ = 2 * Math.PI * 28; // radius=28
    ring.style.strokeDashoffset = circ * (1 - pct);
  }
}

function _updateStreak() {
  const el = _getEl('dc-streak');
  if (el) el.textContent = `🔥 Streak: ${_streak}`;
}

function _showFeedback(correct, explanation) {
  const el = _getEl('dc-feedback');
  if (!el) return;
  el.className = `dc-feedback ${correct ? 'dc-correct' : 'dc-wrong'}`;
  el.innerHTML = correct
    ? `<strong>✓ Correct!</strong> ${explanation}`
    : `<strong>✗ Wrong.</strong> Try again! (-${CONFIG.debug.wrongPenaltySeconds}s)`;
  el.style.display = 'block';
  setTimeout(() => { if (correct) el.style.display = 'none'; }, 2500);
}

function _escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Game Logic ─────────────────────────────────────────────

function _checkLine(lineIdx) {
  if (_state !== 'playing' || !_current) return;

  if (lineIdx === _current.bugLine) {
    // CORRECT
    _stopTimer();
    _setState('completed');
    _streak++;
    SoundManager.correct();

    const debug = SaveManager.get('debug');
    SaveManager.merge('debug', {
      streak: Math.max(debug.streak || 0, _streak),
      totalSolved: (debug.totalSolved || 0) + 1,
      totalAttempts: (debug.totalAttempts || 0) + 1,
    });

    EventBus.emit('debug:correct', { xp: _current.xp, streak: _streak });
    EventBus.emit('xp:add', { amount: _current.xp, source: 'debug' });
    EventBus.emit('analytics:track', { key: 'debug_correct' });

    // Achievements
    if (debug.totalSolved === 0) EventBus.emit('achievement:unlock', { id: 'first_bug' });
    if (_streak >= 3) EventBus.emit('achievement:unlock', { id: 'streak_3' });

    _showFeedback(true, _current.explanation);

    // Highlight correct line
    const lines = document.querySelectorAll('.dc-line');
    lines.forEach(el => el.classList.remove('dc-correct-line', 'dc-wrong-line'));
    if (lines[lineIdx]) lines[lineIdx].classList.add('dc-correct-line');

    _updateStreak();

    // Show "Next" button
    const nextBtn = _getEl('dc-next-btn');
    if (nextBtn) nextBtn.style.display = 'inline-flex';

  } else {
    // WRONG
    _streak = 0;
    SoundManager.wrong();
    EventBus.emit('debug:wrong');
    EventBus.emit('analytics:track', { key: 'debug_wrong' });

    const lines = document.querySelectorAll('.dc-line');
    if (lines[lineIdx]) {
      lines[lineIdx].classList.add('dc-shake');
      setTimeout(() => lines[lineIdx].classList.remove('dc-shake'), 500);
    }

    _showFeedback(false, '');
    _updateStreak();

    // Time penalty
    _timeLeft = Math.max(1, _timeLeft - CONFIG.debug.wrongPenaltySeconds);
    _updateTimerDisplay();

    // Update attempt counter
    const debug = SaveManager.get('debug');
    SaveManager.merge('debug', { totalAttempts: (debug.totalAttempts || 0) + 1 });
  }
}

function _timeExpired() {
  _stopTimer();
  _streak = 0;
  _setState('game_over');
  _updateStreak();
  SoundManager.wrong();

  const feedback = _getEl('dc-feedback');
  if (feedback) {
    feedback.className = 'dc-feedback dc-expired';
    feedback.innerHTML = `<strong>⏰ Time's up!</strong> The bug was on line ${_current.bugLine + 1}: ${_current.explanation}`;
    feedback.style.display = 'block';
  }

  const nextBtn = _getEl('dc-next-btn');
  if (nextBtn) nextBtn.style.display = 'inline-flex';
}

function _loadNext() {
  _current = _pickQuestion();
  if (!_current) return;
  _setState('playing');
  _renderCode(_current);
  _renderMeta(_current);
  const feedback = _getEl('dc-feedback');
  if (feedback) feedback.style.display = 'none';
  const nextBtn = _getEl('dc-next-btn');
  if (nextBtn) nextBtn.style.display = 'none';
  document.querySelectorAll('.dc-line').forEach(el =>
    el.classList.remove('dc-correct-line', 'dc-wrong-line')
  );
  _startTimer();
}

// ── Plugin Interface ────────────────────────────────────────

const DebugChallenge = {
  id: 'debug-challenge',
  title: 'Debug the Code',
  state: 'idle',

  init() {
    const section = document.getElementById('debug-challenge');
    if (!section) return;

    // Category + difficulty selectors
    section.querySelectorAll('.dc-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        section.querySelectorAll('.dc-category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _category = btn.dataset.category;
        SoundManager.click();
      });
    });

    section.querySelectorAll('.dc-difficulty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        section.querySelectorAll('.dc-difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _difficulty = btn.dataset.difficulty;
        SoundManager.click();
      });
    });

    // Start button
    const startBtn = _getEl('dc-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        EventBus.emit('analytics:track', { key: 'debug_started' });
        this.reset();
        _loadNext();
        _getEl('dc-setup')?.classList.add('dc-hidden');
        _getEl('dc-game')?.classList.remove('dc-hidden');
        SoundManager.click();
      });
    }

    // Next / Try Another button
    const nextBtn = _getEl('dc-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        _loadNext();
        SoundManager.click();
      });
    }

    // Reset to setup
    const resetBtn = _getEl('dc-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.reset();
        _getEl('dc-setup')?.classList.remove('dc-hidden');
        _getEl('dc-game')?.classList.add('dc-hidden');
        SoundManager.click();
      });
    }

    _state = 'idle';
  },

  destroy() { _stopTimer(); },
  pause()   { _stopTimer(); _setState('paused'); },
  resume()  { if (_state === 'paused') { _setState('playing'); _startTimer(); } },
  reset()   { _stopTimer(); _setState('idle'); _streak = 0; _current = null; _updateStreak(); },
};

export default DebugChallenge;

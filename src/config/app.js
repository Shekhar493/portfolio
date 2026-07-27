// ============================================================
// src/config/app.js — Single Source of Truth
// All tunable values live here. Modules import, never hardcode.
// ============================================================

export const CONFIG = {
  // Save key (bump to portfolio-v2 for next migration)
  saveKey: 'portfolio-v1',
  version: 1,

  // ── XP Level Progression ──────────────────────────────────
  xpLevels: [
    { level: 1, xp: 0,   title: 'Visitor',          icon: '🧑' },
    { level: 2, xp: 50,  title: 'Developer',        icon: '👨‍💻' },
    { level: 3, xp: 150, title: 'Engineer',         icon: '⚙️' },
    { level: 4, xp: 300, title: 'AI Builder',       icon: '🤖' },
    { level: 5, xp: 500, title: 'System Architect', icon: '🏛️' },
  ],

  // ── Sound ─────────────────────────────────────────────────
  sound: { defaultOn: false }, // Off by default (office-safe)

  // ── Toast ─────────────────────────────────────────────────
  toast: { durationMs: 3000 },

  // ── Debug Challenge ───────────────────────────────────────
  debug: {
    timerSeconds: 30,
    wrongPenaltySeconds: 5,
    xpByDifficulty: { easy: 10, medium: 20, hard: 35 },
  },

  // ── Tech Snake ────────────────────────────────────────────
  snake: {
    speed: 150,       // ms per tick
    gridSize: 20,     // cells per side
    cellPx: 22,       // pixel size per cell
  },

  // ── Feature Flags ─────────────────────────────────────────
  features: {
    snake:       true,
    world:       true,
    analytics:   true,
    sound:       true,
    easterEggs:  true,
    debugChallenge: true,
  },

  // ── Analytics Keys ────────────────────────────────────────
  analyticsKeys: [
    'sonexa_viewed', 'sign2sound_viewed', 'mapping_viewed',
    'snake_played', 'debug_started', 'world_visited',
    'resume_downloaded', 'terminal_used', 'challenge_me_clicked',
  ],

  // ── Achievements Registry ─────────────────────────────────
  achievements: [
    {
      id: 'first_bug',
      icon: '🏆',
      title: 'First Bug Fixed',
      desc: 'Solved your first Debug Challenge.',
      xp: 15,
    },
    {
      id: 'streak_3',
      icon: '🔥',
      title: 'On Fire',
      desc: 'Fixed 3 bugs in a row without a mistake.',
      xp: 25,
    },
    {
      id: 'snake_score_50',
      icon: '🐍',
      title: 'Snake Score 50',
      desc: 'Scored 50 or more in Tech Snake.',
      xp: 20,
    },
    {
      id: 'full_stack_explorer',
      icon: '🌐',
      title: 'Full Stack Explorer',
      desc: 'Collected every technology in Tech Snake.',
      xp: 50,
    },
    {
      id: 'sonexa_lab',
      icon: '🎬',
      title: 'Inside Sonexa Lab',
      desc: 'Entered the Sonexa Lab in Portfolio World.',
      xp: 15,
    },
    {
      id: 'all_buildings',
      icon: '🏙️',
      title: 'City Explorer',
      desc: 'Visited all 6 buildings in Portfolio World.',
      xp: 40,
    },
    {
      id: 'resume_download',
      icon: '📄',
      title: 'Resume Downloaded',
      desc: 'Downloaded the resume.',
      xp: 10,
    },
    {
      id: 'hidden_cmd',
      icon: '🕵️',
      title: 'Hidden Command',
      desc: 'Discovered the secret terminal command.',
      xp: 30,
    },
    {
      id: 'curious_explorer',
      icon: '🦆',
      title: 'Curious Explorer',
      desc: 'Found the hidden duck.',
      xp: 20,
    },
    {
      id: 'open_source',
      icon: '⭐',
      title: 'Open Source Fan',
      desc: 'Clicked the GitHub logo 5 times.',
      xp: 15,
    },
  ],

  // ── Tech Snake Collectibles ───────────────────────────────
  snakeTechs: [
    // Tier 1 — Easy
    { name: 'Python',     icon: '🐍', tier: 1, projects: ['Sonexa', 'Sign2Sound', 'Mapping Tomorrow'] },
    { name: 'JavaScript', icon: '⚡', tier: 1, projects: ['Last Minute Saver', 'Portfolio'] },
    { name: 'HTML5',      icon: '📄', tier: 1, projects: ['Portfolio', 'Last Minute Saver'] },
    { name: 'CSS3',       icon: '🎨', tier: 1, projects: ['Portfolio', 'Last Minute Saver'] },
    { name: 'Git',        icon: '🌿', tier: 1, projects: ['All projects'] },
    // Tier 2 — Medium
    { name: 'React',      icon: '⚛️', tier: 2, projects: ['Sonexa Extension UI'] },
    { name: 'TypeScript', icon: '📘', tier: 2, projects: ['Sonexa Chrome Extension'] },
    { name: 'FastAPI',    icon: '🚀', tier: 2, projects: ['Sonexa Backend', 'AI APIs'] },
    { name: 'REST API',   icon: '🔌', tier: 2, projects: ['Sonexa', 'Sign2Sound'] },
    { name: 'GitHub',     icon: '🐙', tier: 2, projects: ['All open-source projects'] },
    // Tier 3 — Hard
    { name: 'WebSockets', icon: '🔁', tier: 3, projects: ['Sonexa Real-Time Streaming'] },
    { name: 'OpenCV',     icon: '👁️', tier: 3, projects: ['Sign2Sound'] },
    { name: 'MediaPipe',  icon: '✋', tier: 3, projects: ['Sign2Sound Gesture Detection'] },
    { name: 'Chrome Ext', icon: '🧩', tier: 3, projects: ['Sonexa Extension'] },
    { name: 'Pytest',     icon: '🧪', tier: 3, projects: ['Sonexa Test Suite'] },
    // Tier 4 — Expert
    { name: 'AI',         icon: '🤖', tier: 4, projects: ['Sonexa', 'Sign2Sound'] },
    { name: 'LLM',        icon: '🧠', tier: 4, projects: ['AI pipeline integrations'] },
    { name: 'Docker',     icon: '🐳', tier: 4, projects: ['Sonexa deployment'] },
    { name: 'PostgreSQL', icon: '🗄️', tier: 4, projects: ['Backend data persistence'] },
    { name: 'CI/CD',      icon: '⚙️', tier: 4, projects: ['Automated build pipelines'] },
  ],

  // ── Portfolio World Buildings ─────────────────────────────
  worldBuildings: [
    {
      id: 'sonexa_lab',
      name: 'Sonexa Lab',
      icon: '🏢',
      color: '#ff3e3e',
      achievement: 'sonexa_lab',
      content: {
        subtitle: 'AI Live Dubbing Platform',
        description: 'Real-time AI dubbing platform with WebSocket streaming, Chrome Extension, Whisper/Deepgram ASR, translation pipeline, and synthetic voice generation.',
        tech: ['FastAPI', 'WebSockets', 'React', 'Chrome Extension', 'Whisper/Deepgram'],
        github: 'https://github.com/Shekhar493',
      },
    },
    {
      id: 'ai_projects',
      name: 'AI Projects',
      icon: '🔬',
      color: '#a855f7',
      achievement: null,
      content: {
        subtitle: 'Computer Vision & ML',
        description: 'Sign2Sound — real-time sign language to speech using MediaPipe + OpenCV. Applied Machine Learning Suite — notebooks, model pipelines, EDA.',
        tech: ['MediaPipe', 'OpenCV', 'Python', 'Scikit-Learn', 'Jupyter'],
        github: 'https://github.com/Shekhar493',
      },
    },
    {
      id: 'fullstack_studio',
      name: 'Full Stack Studio',
      icon: '🛠️',
      color: '#10b981',
      achievement: null,
      content: {
        subtitle: 'Web Apps & Geospatial Tools',
        description: 'Mapping Tomorrow — Pokhara risk dashboard with GeoPandas + Folium. The Last Minute Saver — Hackfest x Google for Developers web app.',
        tech: ['Streamlit', 'GeoPandas', 'JavaScript', 'HTML5', 'CSS3'],
        github: 'https://github.com/Shekhar493/Mapping_Tommorow',
      },
    },
    {
      id: 'skills_hq',
      name: 'Skills HQ',
      icon: '⚡',
      color: '#f59e0b',
      achievement: null,
      content: {
        subtitle: 'Technical Expertise',
        description: 'AI & Computer Vision · Backend & Real-Time · Frontend & Extensions · GIS & Mapping · Software Engineering',
        tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'WebSockets', 'OpenCV'],
        github: null,
      },
    },
    {
      id: 'resume_vault',
      name: 'Resume Vault',
      icon: '📄',
      color: '#06b6d4',
      achievement: 'resume_download',
      content: {
        subtitle: 'Experience & Resume',
        description: 'Software developer with experience in AI systems, real-time applications, and geospatial tools. Based in Kathmandu, Nepal.',
        tech: [],
        github: null,
        download: true,
      },
    },
    {
      id: 'contact_hub',
      name: 'Contact Hub',
      icon: '📡',
      color: '#ec4899',
      achievement: null,
      content: {
        subtitle: 'Get In Touch',
        description: 'chandrashekhary866@gmail.com · github.com/Shekhar493 · LinkedIn: Chandra Shekhar Yadav',
        tech: [],
        github: null,
        links: {
          email: 'mailto:chandrashekhary866@gmail.com',
          github: 'https://github.com/Shekhar493',
          linkedin: 'https://www.linkedin.com/in/chandra-shekhar-yadav-a359a4346',
        },
      },
    },
  ],
};

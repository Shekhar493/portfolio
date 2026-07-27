// ===== Imports for Core System & UI =====
import PortfolioManager from './src/core/portfolioManager.js';
import EventBus from './src/core/eventBus.js';
import SaveManager from './src/core/saveManager.js';
import SoundManager from './src/core/soundManager.js';
import Analytics from './src/core/analytics.js';
import Toast from './src/ui/toast.js';
import HUD from './src/ui/hud.js';
import Progress from './src/ui/progress.js';

document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initTypewriter();
    initThemeManager();
    initTerminal();
    initCommandPalette();
    initStatsCounter();
    initSkillBars();
    init3DTilt();
    initProjectModals();
    initContactForm();
    initNavigation();
    initCursorFollower();
    initInteractiveSystem();
});

// ===== 1. Interactive Background Particle Canvas =====
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 65);
    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            this.x += this.vx;
            this.y += this.vy;

            // Mouse attraction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff3e3e';
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff3e3e';

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    ctx.strokeStyle = primaryColor;
                    ctx.globalAlpha = (1 - dist / 110) * 0.25;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1.0;
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== 2. Typewriter Effect =====
function initTypewriter() {
    const typewriterEl = document.querySelector('.typewriter-text');
    if (!typewriterEl) return;

    const phrases = [
        'Full-Stack Web Applications',
        'High-Performance C Systems',
        'Python Automation Scripts',
        'Modern Responsive UIs'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIdx];

        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 90;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }
    type();
}

// ===== 3. Theme Manager =====
function initThemeManager() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const themeOptions = document.querySelectorAll('.theme-option');

    const savedTheme = localStorage.getItem('portfolio-theme') || 'default';
    setTheme(savedTheme);

    if (themeToggle && themeMenu) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            themeMenu.classList.remove('active');
        });
    }

    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.getAttribute('data-theme');
            setTheme(theme);
            if (themeMenu) themeMenu.classList.remove('active');
            showToast(`Theme switched to ${opt.textContent.trim()}! 🎨`);
        });
    });

    function setTheme(theme) {
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('portfolio-theme', theme);
    }
}

// ===== 4. Interactive Developer Terminal Simulator =====
function initTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const presets = document.querySelectorAll('.preset-chip');

    if (!terminalOutput || !terminalInput) return;

    const commands = {
        help: () => `Available Commands:<br>
  - <span class="highlight">sonexa</span> : Learn about Sonexa (AI Live Dubbing Platform)<br>
  - <span class="highlight">sign2sound</span> : Learn about Sign2Sound (Sign Language Accessibility)<br>
  - <span class="highlight">about</span> : Learn about Chandra Shekhar Yadav<br>
  - <span class="highlight">skills</span> : List technical domains and proficiencies<br>
  - <span class="highlight">projects</span> : View key highlighted projects<br>
  - <span class="highlight">contact</span> : Get social media and email info<br>
  - <span class="highlight">theme [violet|matrix|cyberpunk|default]</span> : Switch terminal/portfolio theme<br>
  - <span class="highlight">clear</span> : Clear terminal output<br>
  - <span class="highlight">repo</span> : View GitHub repository link<br>
  - <span class="highlight">achievements</span> : View your unlocked achievements<br>
  - <span class="highlight">xp</span> : View your XP & level progression<br>
  - <span class="highlight">analytics</span> : View privacy-safe interaction stats<br>
  - <span class="highlight">mode [classic|interactive]</span> : Switch portfolio mode<br>
  - <span class="highlight">sound [on|off]</span> : Toggle audio effects<br>
  - <span class="highlight">whoami</span> : Display current session visitor info`,
        sonexa: () => `<strong>Sonexa — AI Live Dubbing Platform</strong><br>
  - Core Stack: FastAPI, WebSockets, Async Python, Chrome Extension, React<br>
  - Features: Real-time audio streaming, Whisper/Deepgram ASR, translation pipeline, synthetic voice output<br>
  - Architecture: Modular provider architecture with low-latency streaming.`,
        sign2sound: () => `<strong>Sign2Sound — Sign Language Accessibility</strong><br>
  - Core Stack: MediaPipe, OpenCV, Python, Computer Vision, Speech Synthesis<br>
  - Features: Real-time gesture detection, sign language to speech translation, text-to-Braille concepts.`,
        about: () => `I'm a software developer passionate about building intelligent systems that solve real-world problems. My interests span AI, full-stack web development, computer vision, accessibility technologies, and geospatial applications.`,
        skills: () => `Technical Expertise:<br>
  - AI & Computer Vision (OpenCV, MediaPipe, Speech ASR/TTS, Translation) [92%]<br>
  - Backend & Real-Time (Python, FastAPI, WebSockets, Async Pipelines) [94%]<br>
  - Frontend & Extensions (React, TypeScript, JS, Chrome Extensions) [90%]<br>
  - GIS & Mapping (GeoPandas, OSMnx, Folium, PyDeck, OSM) [88%]<br>
  - Software Engineering (Monorepo, Modular Design, C, Git, Pytest) [91%]`,
        projects: () => `Featured Work:<br>
  1. Sonexa — AI Live Dubbing Platform [FastAPI / WebSockets / Extension]<br>
  2. Sign2Sound — Accessibility Platform [MediaPipe / OpenCV / Speech]<br>
  3. Mapping Tomorrow — Pokhara Disaster & Risk Dashboard [Streamlit / OSM]<br>
  4. The Last Minute Saver — Hackfest x Google for Developers Tool<br>
  5. Spell Bee — Interactive Word Puzzle Game [Python]<br>
  6. Applied Machine Learning Suite [Supervised/Unsupervised Models]`,
        contact: () => `Contact Info:<br>
  - Email: <a href="mailto:chandrashekhary866@gmail.com" style="color:var(--primary-color)">chandrashekhary866@gmail.com</a><br>
  - LinkedIn: <a href="https://www.linkedin.com/in/chandra-shekhar-yadav-a359a4346" target="_blank" style="color:var(--primary-color)">Chandra Shekhar Yadav</a><br>
  - GitHub: <a href="https://github.com/Shekhar493" target="_blank" style="color:var(--primary-color)">github.com/Shekhar493</a>`,
        achievements: () => {
            const st = PortfolioManager.getState();
            return `🏆 Unlocked ${st.achievements.length}/${st.totalAchievements} Achievements. Type 'xp' for level details.`;
        },
        xp: () => {
            const st = PortfolioManager.getState();
            return `${st.levelIcon} Level ${st.level} (${st.levelTitle}) · Total XP: ${st.xp}`;
        },
        level: () => {
            const st = PortfolioManager.getState();
            return `${st.levelIcon} Level ${st.level}: ${st.levelTitle} · XP: ${st.xp}`;
        },
        konami: () => {
            EventBus.emit('achievement:unlock', { id: 'hidden_cmd' });
            return `🕵️ Secret command found! +30 XP awarded!`;
        },
        analytics: () => Analytics.getSummary(),
        whoami: () => `guest@chandra-shekhar-portfolio [Permission: Visitor]`,
        repo: () => `GitHub Repository: <a href="https://github.com/Shekhar493/portfolio" target="_blank" style="color:var(--primary-color)">https://github.com/Shekhar493/portfolio</a>`,
        sudo: () => `<span class="warning">Nice try! Permission denied: User is not in the sudoers file. This incident will be reported.</span>`,
        clear: () => {
            terminalOutput.innerHTML = `<div class="terminal-line info">Terminal cleared. Type 'help' for options.</div>`;
            return null;
        }
    };

    function executeCommand(cmdStr) {
        const rawCmd = cmdStr.trim();
        if (!rawCmd) return;

        // Print input prompt
        const lineIn = document.createElement('div');
        lineIn.className = 'terminal-line';
        lineIn.innerHTML = `<span class="terminal-prompt-symbol">shekhar@portfolio:~$</span> ${escapeHtml(rawCmd)}`;
        terminalOutput.appendChild(lineIn);

        const parts = rawCmd.split(' ');
        const mainCmd = parts[0].toLowerCase();

        if (mainCmd === 'theme') {
            const themeArg = parts[1]?.toLowerCase();
            if (['violet', 'matrix', 'cyberpunk', 'default'].includes(themeArg)) {
                if (themeArg === 'default') document.documentElement.removeAttribute('data-theme');
                else document.documentElement.setAttribute('data-theme', themeArg);
                localStorage.setItem('portfolio-theme', themeArg);
                printOutput(`Theme changed to '${themeArg}'!`, 'success');
            } else {
                printOutput(`Usage: theme [default | violet | matrix | cyberpunk]`, 'warning');
            }
        } else if (mainCmd === 'sound') {
            const soundArg = parts[1]?.toLowerCase();
            if (soundArg === 'on' || soundArg === 'off') {
                const on = soundArg === 'on';
                EventBus.emit('sound:toggle', { on });
                printOutput(`Audio effects turned ${soundArg.toUpperCase()}!`, 'success');
            } else {
                printOutput(`Usage: sound [on | off]`, 'warning');
            }
        } else if (mainCmd === 'mode') {
            const modeArg = parts[1]?.toLowerCase();
            if (modeArg === 'classic' || modeArg === 'interactive') {
                PortfolioManager.setMode(modeArg);
                const modeCheckbox = document.getElementById('mode-toggle-checkbox');
                if (modeCheckbox) modeCheckbox.checked = (modeArg === 'interactive');
                printOutput(`Portfolio mode set to '${modeArg.toUpperCase()}'!`, 'success');
            } else {
                printOutput(`Usage: mode [classic | interactive]`, 'warning');
            }
        } else if (commands[mainCmd]) {
            const result = commands[mainCmd]();
            if (result !== null) {
                printOutput(result, 'output');
            }
        } else {
            printOutput(`Command not found: '${escapeHtml(rawCmd)}'. Type '<span class="highlight">help</span>' for options.`, 'warning');
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function printOutput(html, type = 'output') {
        const lineOut = document.createElement('div');
        lineOut.className = `terminal-line ${type}`;
        lineOut.innerHTML = html;
        terminalOutput.appendChild(lineOut);
    }

    if (terminalForm) {
        terminalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = terminalInput.value;
            terminalInput.value = '';
            executeCommand(val);
        });
    }

    presets.forEach(p => {
        p.addEventListener('click', () => {
            const cmd = p.getAttribute('data-cmd');
            executeCommand(cmd);
        });
    });
}

// ===== 5. Command Palette (Ctrl+K / ⌘K) =====
function initCommandPalette() {
    const backdrop = document.getElementById('cmd-palette');
    const input = document.getElementById('cmd-input');
    const results = document.getElementById('cmd-results');
    const trigger = document.getElementById('cmd-k-trigger');

    if (!backdrop || !input || !results) return;

    const items = [
        { title: 'Go to Home', icon: 'fa-home', action: () => scrollToId('home') },
        { title: 'About Chandra Shekhar', icon: 'fa-user', action: () => scrollToId('about') },
        { title: 'Interactive Developer Terminal', icon: 'fa-terminal', action: () => scrollToId('terminal') },
        { title: 'Skills & Proficiency', icon: 'fa-code', action: () => scrollToId('skills') },
        { title: 'Featured Projects', icon: 'fa-layer-group', action: () => scrollToId('projects') },
        { title: 'Contact Me', icon: 'fa-envelope', action: () => scrollToId('contact') },
        { title: 'View GitHub Profile', icon: 'fa-github', action: () => window.open('https://github.com/Shekhar493', '_blank') },
        { title: 'Switch to Cyber Red Theme', icon: 'fa-palette', action: () => setTheme('default') },
        { title: 'Switch to Neon Violet Theme', icon: 'fa-bolt', action: () => setTheme('violet') },
        { title: 'Switch to Matrix Green Theme', icon: 'fa-terminal', action: () => setTheme('matrix') }
    ];

    function setTheme(t) {
        if (t === 'default') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('portfolio-theme', t);
        showToast(`Theme set to ${t}!`);
    }

    function scrollToId(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    function openPalette() {
        backdrop.classList.add('active');
        input.value = '';
        renderResults('');
        setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
        backdrop.classList.remove('active');
    }

    function renderResults(filter) {
        results.innerHTML = '';
        const filtered = items.filter(i => i.title.toLowerCase().includes(filter.toLowerCase()));

        if (filtered.length === 0) {
            results.innerHTML = `<div style="padding: 1rem; text-align: center; color: #94a3b8;">No matching results found</div>`;
            return;
        }

        filtered.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = `cmd-item ${idx === 0 ? 'selected' : ''}`;
            div.innerHTML = `
                <div class="cmd-item-left">
                    <i class="fas ${item.icon}"></i>
                    <span>${item.title}</span>
                </div>
                <span class="cmd-shortcut">Jump</span>
            `;
            div.addEventListener('click', () => {
                item.action();
                closePalette();
            });
            results.appendChild(div);
        });
    }

    if (trigger) trigger.addEventListener('click', openPalette);

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (backdrop.classList.contains('active')) closePalette();
            else openPalette();
        } else if (e.key === 'Escape' && backdrop.classList.contains('active')) {
            closePalette();
        }
    });

    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closePalette();
    });

    input.addEventListener('input', (e) => {
        renderResults(e.target.value);
    });
}

// ===== 6. Animated Stats Counter =====
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            hasAnimated = true;
            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'), 10);
                let current = 0;
                const increment = Math.max(1, Math.ceil(target / 40));
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        num.textContent = target + (target === 15 ? '+' : target === 5 ? '+' : '');
                        clearInterval(timer);
                    } else {
                        num.textContent = current;
                    }
                }, 30);
            });
        }
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);
}

// ===== 7. Skill Progress Bars =====
function initSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    if (!skillCards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.skill-bar-fill');
                if (fill) {
                    const targetWidth = fill.getAttribute('data-progress');
                    fill.style.width = targetWidth;
                }
            }
        });
    }, { threshold: 0.2 });

    skillCards.forEach(card => observer.observe(card));
}

// ===== 8. 3D Tilt Effect =====
function init3DTilt() {
    const cards = document.querySelectorAll('.skill-card, .project-card, .stat-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// ===== 9. Project Quick View Modals =====
function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-content-body');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');

    if (!modal || !modalBody) return;

    const projectData = {
        sonexa: {
            title: 'Sonexa — AI-Powered Live Dubbing Platform',
            category: 'Real-Time AI & WebSockets System Architecture',
            description: 'A flagship real-time AI live dubbing and translation platform combining WebSocket backend streaming, Chrome Extension audio capture, Whisper/Deepgram ASR, translation pipeline, and low-latency synthetic AI voice generation.',
            tech: ['FastAPI', 'WebSockets', 'Async Python', 'Chrome Extension', 'React', 'Whisper/Deepgram ASR', 'TTS Voice Pipelines'],
            features: [
                'Real-time low-latency WebSocket audio streaming & dubbing pipeline',
                'Chrome Extension for instant web audio stream capture',
                'Modular provider architecture supporting multiple ASR, Translation, and TTS providers',
                'Asynchronous backend pipeline designed for minimal latency overhead'
            ],
            github: 'https://github.com/Shekhar493'
        },
        sign2sound: {
            title: 'Sign2Sound — Sign Language Accessibility Platform',
            category: 'Computer Vision & Accessibility Tech',
            description: 'An accessibility-focused platform detecting sign language hand gestures in real time using MediaPipe and OpenCV, translating gestures to audible speech and text-to-Braille concepts.',
            tech: ['Python', 'MediaPipe', 'OpenCV', 'Computer Vision', 'Speech Synthesis', 'Braille Concepts'],
            features: [
                'Real-time 3D hand tracking and landmark gesture recognition',
                'Instant translation of recognized signs into natural speech output',
                'Text-to-Braille tactile concepts for multi-modal accessibility',
                'High FPS vision processing pipeline'
            ],
            github: 'https://github.com/Shekhar493'
        },
        'mapping-tomorrow': {
            title: 'Mapping Tomorrow: Pokhara Risk & Resource Dashboard',
            category: 'Python, Streamlit & Geospatial GIS',
            description: 'A geospatial web application designed to visualize circular economy resources (waste/recycling points) and analyze their vulnerability to natural disasters (floods, landslides) in Pokhara, Nepal using OpenStreetMap (OSM) data.',
            tech: ['Python 3', 'Streamlit', 'OpenStreetMap API', 'Folium', 'Geospatial Analysis'],
            features: [
                'Interactive hazard and disaster risk mapping for Pokhara, Nepal',
                'Circular economy resource point visualization and categorization',
                'Vulnerability analysis against flood and landslide zone overlays',
                'OpenStreetMap (OSM) live data integration'
            ],
            github: 'https://github.com/Shekhar493/Mapping_Tommorow'
        },
        'last-minute-saver': {
            title: 'The Last Minute Saver',
            category: 'Web Application (Hackfest x Google for Developers)',
            description: 'Engineered for Hackfest x Google for Developers — a rapid emergency study preparation and resource consolidation application designed to help students optimize exam review under tight deadlines.',
            tech: ['JavaScript ES6+', 'HTML5/CSS3', 'Google Developer APIs', 'Web Stack'],
            features: [
                'Rapid resource indexer and study material breakdown',
                'Focus session timer and milestone tracker',
                'Built during Hackfest in collaboration with Google for Developers',
                'Responsive glassmorphism UI'
            ],
            github: 'https://github.com/Shekhar493/The-Last-Minute-Saver'
        },
        'spell-bee': {
            title: 'Spell Bee Interactive Word Game',
            category: 'Python Game Development & Logic',
            description: 'An interactive word puzzle game testing spelling speed, vocabulary recall, and letter pattern recognition with real-time scoring.',
            tech: ['Python 3', 'Interactive Terminal/GUI', 'Word Algorithms'],
            features: [
                'Dynamic word dictionary validation',
                'Score multiplier for complex & rare words',
                'Interactive hint engine and timer',
                'Clean game loop architecture'
            ],
            github: 'https://github.com/Shekhar493/Spell-Bee'
        },
        'ml-cfe': {
            title: 'Applied Machine Learning Suite',
            category: 'Machine Learning & Data Science',
            description: 'A collection of machine learning notebooks and model implementations exploring predictive modeling, supervised/unsupervised learning, data preprocessing, and algorithm evaluation.',
            tech: ['Python', 'Jupyter Notebooks', 'Scikit-Learn', 'Pandas', 'NumPy'],
            features: [
                'Supervised classification and regression models',
                'Feature selection and hyperparameter tuning',
                'Data visualization & exploratory data analysis (EDA)',
                'Model evaluation metrics (Accuracy, Precision, Recall, ROC-AUC)'
            ],
            github: 'https://github.com/Shekhar493/machine_learning_cfe'
        },
        portfolio: {
            title: 'Interactive Personal Portfolio',
            category: 'Web Development & UI/UX',
            description: 'A high-performance, glassmorphic portfolio featuring custom particle animations, interactive CLI developer terminal, live theme switcher, command palette (⌘K), and responsive design.',
            tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Vite', 'Font Awesome'],
            features: [
                'Interactive Background Particles Canvas with mouse attraction',
                'Embedded zsh-like Developer Terminal Simulator',
                'Command Palette (Ctrl+K) for instant keyboard navigation',
                'Multi-Theme Switching (Cyber Red, Neon Violet, Matrix Green, Cyberpunk)',
                'Clean Vite bundling setup'
            ],
            github: 'https://github.com/Shekhar493/portfolio'
        },
        'python-learning': {
            title: 'Python Learning & Systems Automation',
            category: 'Python Development & Utilities',
            description: 'Comprehensive repository covering Python programming fundamentals, custom automation utilities, data structures, and practical scripting exercises.',
            tech: ['Python 3', 'CLI Tools', 'Data Structures', 'Automation'],
            features: [
                'Automated file & system management scripts',
                'Core algorithm implementations in pure Python',
                'Hands-on exercises and clean modular structure'
            ],
            github: 'https://github.com/Shekhar493/Python_Learning'
        }
    };

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pid = btn.getAttribute('data-project');
            const data = projectData[pid];
            if (!data) return;

            modalBody.innerHTML = `
                <div style="font-size: 0.85rem; color: var(--primary-color); font-weight: 600; text-transform: uppercase;">${data.category}</div>
                <h2 style="font-size: 1.8rem; margin: 0.4rem 0 1rem 0; color: #fff;">${data.title}</h2>
                <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1.5rem;">${data.description}</p>
                
                <h4 style="color: #fff; margin-bottom: 0.5rem;"><i class="fas fa-microchip" style="color:var(--primary-color)"></i> Tech Stack</h4>
                <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom: 1.5rem;">
                    ${data.tech.map(t => `<span style="background:rgba(255,255,255,0.08); padding:0.3rem 0.7rem; border-radius:6px; font-size:0.85rem; border:1px solid var(--glass-border);">${t}</span>`).join('')}
                </div>

                <h4 style="color: #fff; margin-bottom: 0.5rem;"><i class="fas fa-star" style="color:var(--primary-color)"></i> Key Features</h4>
                <ul style="color: #cbd5e1; padding-left: 1.2rem; margin-bottom: 1.5rem; line-height: 1.8;">
                    ${data.features.map(f => `<li>${f}</li>`).join('')}
                </ul>

                <div style="display:flex; gap:1rem; margin-top: 1.5rem;">
                    <a href="${data.github}" target="_blank" class="btn btn-primary" style="font-size:0.9rem;">
                        <i class="fab fa-github"></i> View GitHub Repository
                    </a>
                </div>
            `;
            modal.classList.add('active');
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

// ===== 10. Contact Form Handling & Toast =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        if (!name || !email || !message) {
            showToast('Please fill out all required fields.', 'warning');
            return;
        }

        const submitBtn = document.getElementById('contact-submit');
        const origText = submitBtn.innerHTML;

        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = `<i class="fas fa-check"></i> Message Sent!`;
            submitBtn.style.background = '#10b981';
            showToast(`Thank you ${name}! Your message has been received. ✨`, 'success');
            form.reset();

            setTimeout(() => {
                submitBtn.innerHTML = origText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1200);
    });
}

// ===== 11. Navigation & Cursor Follower =====
function initNavigation() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initCursorFollower() {
    const cursorFollower = document.querySelector('.cursor-follower');
    if (!cursorFollower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        cursorFollower.style.left = `${followerX}px`;
        cursorFollower.style.top = `${followerY}px`;
        requestAnimationFrame(animate);
    }
    animate();

    if (window.innerWidth <= 768) {
        cursorFollower.style.display = 'none';
    }
}

// ===== Interactive System Initialization =====
function initInteractiveSystem() {
    Toast.init();
    HUD.init();
    Progress.init();
    Analytics.init();
    PortfolioManager.init();

    // Mode Toggle Checkbox
    const modeCheckbox = document.getElementById('mode-toggle-checkbox');
    if (modeCheckbox) {
        const initialMode = PortfolioManager.getState().mode;
        modeCheckbox.checked = (initialMode === 'interactive');
        modeCheckbox.addEventListener('change', () => {
            const mode = modeCheckbox.checked ? 'interactive' : 'classic';
            PortfolioManager.setMode(mode);
            showToast(`Switched to ${mode.toUpperCase()} mode!`);
        });
    }

    // Sound Toggle Button
    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    if (soundBtn && soundIcon) {
        const updateSoundUI = (on) => {
            soundIcon.className = on ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            soundBtn.style.color = on ? 'var(--primary-color)' : '#cbd5e1';
        };
        updateSoundUI(SaveManager.get('sound'));
        soundBtn.addEventListener('click', () => {
            const current = SaveManager.get('sound');
            EventBus.emit('sound:toggle', { on: !current });
            updateSoundUI(!current);
            showToast(`Sound ${!current ? 'Enabled 🔊' : 'Disabled 🔇'}`);
        });
    }

    // Achievements Button
    const achBtn = document.getElementById('achievements-modal-btn');
    if (achBtn) {
        achBtn.addEventListener('click', () => {
            const achEl = document.getElementById('achievements');
            if (achEl) achEl.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Challenge Me Button
    const challengeBtn = document.getElementById('challenge-me-btn');
    if (challengeBtn) {
        challengeBtn.addEventListener('click', () => {
            EventBus.emit('challenge:random');
        });
    }

    // GitHub Logo 5-click Easter Egg
    const githubLogos = document.querySelectorAll('a[href*="github.com"]');
    githubLogos.forEach(logo => {
        logo.addEventListener('click', () => {
            EventBus.emit('github:click');
        });
    });

    // Initial Progress Render
    Progress.render(PortfolioManager.getState());
    HUD.update(PortfolioManager.getState());
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[m]);
}


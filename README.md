# 🚀 Chandra Shekhar Yadav - Interactive Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![C Programming](https://img.shields.io/badge/C-A8B9CC?logo=c&logoColor=white)](https://en.cppreference.com/w/c)

An ultra-modern, high-interactivity developer portfolio built for **Chandra Shekhar Yadav** — featuring an interactive background particle canvas, an embedded `zsh`-like CLI terminal simulator, a command search palette (`⌘K`), dynamic theme switching, 3D card tilt effects, project quick-view modals, and scroll-triggered stats counters.

---

## 🌟 Key Interactive Features

- **⚡ Interactive Particle Canvas Background**: Real-time canvas particle constellation that reacts to mouse movements and draws dynamic connection lines.
- **🖥️ Embedded Developer Terminal Simulator**: Interactive in-browser terminal shell supporting commands like `help`, `about`, `skills`, `projects`, `contact`, `theme`, `clear`, `repo`, `whoami`, and preset chips for fast execution.
- **🔍 Quick Search Command Palette (`Ctrl+K` / `⌘K`)**: Instant keyboard search overlay allowing visitors to jump to any section, toggle themes, or view social profiles.
- **🎨 Dynamic Multi-Theme Engine**: Real-time theme switcher with persistent settings (`Cyber Red`, `Neon Violet`, `Matrix Green`, and `Cyberpunk`).
- **🕹️ 3D Card Tilt & Parallax**: Mouse tracking 3D tilt effects on skills, statistics, and project showcase cards.
- **📊 Animated Stats Counter**: Scroll-triggered numerical counters highlighting key achievements and project metrics.
- **🔍 Project Quick View Modals**: Modal drawers offering detailed architecture breakdowns, tech stack chips, and feature lists for featured projects.
- **💬 Real-Time Form Validation & Toast Notifications**: Interactive toast notification system providing feedback for form submissions and user interactions.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: HTML5 Semantic Markup, Modern Vanilla CSS3 (Custom Variables, Glassmorphism, Neumorphism, Flexbox, Grid), JavaScript ES6+ Modules
- **Build System**: [Vite](https://vitejs.dev/)
- **Icons & Typography**: [Font Awesome 6](https://fontawesome.com/), Google Fonts (*Inter*, *Outfit*, *Fira Code*)
- **Deployment Environments**: Compatible with Vercel, Netlify, GitHub Pages, or any static web host.

---

## 📁 Repository Structure

```text
portfolio/
├── index.html          # Primary landing page & interactive showcases
├── projects.html       # Comprehensive project catalog & filter section
├── style.css           # Global design system, glassmorphism & theme definitions
├── projects.css        # Detailed projects page layout & filter animations
├── script.js           # Particle canvas, terminal simulator, command palette, theme manager
├── projects.js         # Filtering & project category logic
├── profile.jpg         # Profile photograph asset
├── package.json        # Dependencies & Vite scripts
├── vercel.json         # Deployment rules & headers for Vercel
├── netlify.toml        # Netlify deployment configuration
└── dist/               # Production bundle output
```

---

## 💻 Local Development Setup

### 1. Prerequisites
Ensure Node.js (v18+) and npm are installed on your machine.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/Shekhar493/portfolio.git
cd portfolio
npm install
```

### 3. Start Development Server
Run Vite in development mode with hot module replacement:

```bash
npm run dev
```

### 4. Production Build
Compile and bundle optimized assets for production:

```bash
npm run build
```

### 5. Preview Production Build
Preview local production build:

```bash
npm run preview
```

---

## 📜 Interactive Terminal Commands List

| Command | Action / Description |
| :--- | :--- |
| `help` | Lists all available interactive commands |
| `about` | Displays personal background and summary |
| `skills` | Displays core technical skills and proficiencies |
| `projects` | Highlights featured projects and stack details |
| `contact` | Prints social links and direct email contact |
| `theme [theme_name]` | Switches theme dynamically (`default`, `violet`, `matrix`, `cyberpunk`) |
| `repo` | Direct link to the GitHub repository |
| `whoami` | Displays current visitor session information |
| `clear` | Clears terminal history |

---

## 🚀 Deployment Config

### Vercel
The project includes `vercel.json` pre-configured for static asset routing and build output pointing to `dist`.

### Netlify
The project includes `netlify.toml` pre-configured with `publish = "dist"` and `command = "npm run build"`.

---

## 📄 License & Attribution

Designed and engineered with ❤️ by **Chandra Shekhar Yadav**.  
Open for customization and personal portfolio usage under the MIT License.

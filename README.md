# 🛸 Zain-OS: Dynamic 3D Sci-Fi Developer Portfolio

Welcome to the repository for my personal developer portfolio! 

Designed around a futuristic, hardware-accelerated **developer terminal overlay (Zain-OS)**, this project blends core mathematical modeling, 3D WebGL meshes, trigonometric carousels, and an offline AI chatbot to showcase my projects, skills, and academic journey.

👉 **Live Site Link:** [portfolio-liard-eight-52.vercel.app](https://portfolio-liard-eight-52.vercel.app/)

---

## 🌟 Key Features

### 1. Futuristic Desktop & Mobile HUD (Heads-Up Display)
*   **Coordinate Tracker:** Monospace X/Y cursor tracker and scroll-depth percentage displays.
*   **Dynamic Vitals Monitor:** Interactive, fluctuating readouts for CPU load, memory usage, network latency, and session uptime.
*   **Interactive Minimap:** A scrollbar replacement showing section nodes (`HOME`, `ABOUT`, `SKILLS`, `PROJ`, etc.) that glow to indicate your current reading viewport.
*   **2D Canvas Radar Scan:** A bottom-right radar sweep animation that dynamically matches the active theme color.
*   **Mobile-Optimized HUD:** A responsive mini-HUD that tracks touch movements (`touchstart`/`touchmove`) and system states on mobile viewports.

### 2. Interactive 3D WebGL Lattice Particle Mesh
*   **Procedural Grid:** A fixed-background 3D canvas rendering 48 particles bound by connecting line networks.
*   **Spring Physics Attraction:** The nodes detect mouse coordinates on a Z=0 projection, magnetizing towards the cursor with spring tension and momentum decay.
*   **Camera Dolly Zoom:** Camera position and rotation tilt and zoom dynamically based on global page scroll depth.
*   **Real-Time Theme Sync:** Queries custom CSS accent variables on a rate-limited frame loop, allowing nodes to switch colors instantly when themes change.

### 3. Trigonometric 3D Carousels
*   **Horizontal Projects Carousel:** Cards are distributed mathematically along a virtual 3D horizontal cylinder. Features autoplay, mouse-draggable rotation, hover-to-pause, and console-like telemetry controls.
*   **Vertical Education Rolodex:** Milestone cards are distributed on a vertical cylinder ($y = \sin(\theta)$, $z = \cos(\theta)$) tilting on the X-axis to simulate a vintage rolodex card deck. Supports vertical dragging and swipe navigation.

### 4. Live AI Console Agent & Chatbot Widget
*   **Offline NLP Knowledge Base:** A modular query matcher (`src/utils/aiAgent.js`) that parses user input regarding projects, skills, contact, and studies, serving instantaneous answers without API latency or server keys.
*   **Floating Chat Dialog:** A floating glassmorphic terminal panel with suggestion chips, input field, mechanical typing audio cues, and a dynamic soundwave visualizer that pulses while the AI is compiling responses.
*   **Terminal Command Shell:** Visitors can type `ask-zain [question]` or `chat` inside the footer terminal, triggering decryption matrix text animations in the logs buffer.

### 5. Interactive Developer Terminal Emulator (Hacker Shell)
*   Equipped with history mapping (Up/Down arrow scrolling) and a custom blinking caret cursor.
*   **Normal Commands:** `help`, `about`, `skills`, `projects`, `contact`, `download-cv`, `theme [name]`, `clear`.
*   **🎮 Secret Commands & Easter Eggs:**
    *   `matrix`: Triggers a full-screen falling Katakana matrix rain digital overlay.
    *   `hack`: Simulates a WAF-bypass penetration test with staggered logging lines.
    *   `glitch`: Distorts the entire viewport with a 3-second chromatic aberration jitter.
    *   `snake`: Starts a playable 2D Snake arcade game rendered inside the terminal output!
    *   `sudo`: Renders an ASCII ACCESS DENIED warning box.
    *   `cyber-bypass`: Initiates a 3-stage portfolio anagram decryption puzzle.

### 6. Math-Infused Card Visualizers
Hovering over major skill and project cards activates real-time algorithmic drawings:
*   *CPI Dynamics:* A force-directed node repulsion vector similarity graph.
*   *Gradient Descent:* A 3D saddle curve drawing a weights coordinate sliding down to the optimal minimum.
*   *Latency Routing:* Linear data nodes stretching elastic connection paths.
*   *Metal Slug Engine:* Sprites bouncing off the cursor collider boundary.

---

## 🛠️ Technology Stack

*   **Core Framework:** [React](https://react.dev/) + [Vite](https://vite.dev/) (For ultra-fast building and Hot Module Replacement)
*   **3D WebGL Rendering:** [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) + [React Three Drei](https://github.com/pmndrs/drei)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + CSS Custom Variables (Unified styling and live theme overrides)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) + [GSAP (GreenSock)](https://gsap.com/) (For staggered text reveals and timeline scroll triggers)
*   **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/) (For weighted trackpad kinetic scrolls)
*   **Audio Synthesis:** Web Audio API (Procedural synthesizer generating tactile clicks and boot chimes)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
├── public/                     # Static assets (CV, volunteers certificate)
├── src/
│   ├── assets/                 # SVGs and static image files
│   ├── components/
│   │   ├── canvas/             # R3F WebGL Canvas Components
│   │   │   └── LatticeMesh.jsx # Interactive 3D point network background
│   │   ├── common/             # Layout templates (Navbar, Footer)
│   │   └── ui/                 # Interactive widgets & UI elements
│   │       ├── AiChatbot.jsx   # Floating AI Agent dialogue box
│   │       ├── Card.jsx        # Tilt-responsive card containers
│   │       ├── HudOverlay.jsx  # Fixed telemetry indicators overlay
│   │       ├── InteractiveConsole.jsx # Monospace CLI console emulator
│   │       └── ...
│   ├── data/                   # Static content arrays (Projects, Education)
│   ├── sections/               # Main layout page sections
│   │   ├── Hero.jsx            # Kinetic typography landing section
│   │   ├── About.jsx           # Profile narrative & focus zone badges
│   │   ├── Skills.jsx          # Skills slide deck carousel
│   │   └── ...
│   ├── styles/                 # Tailwind base styles and theme keyframes
│   ├── utils/                  # Helper utilities
│   │   ├── aiAgent.js          # Local chatbot NLP query responder
│   │   ├── audio.js            # Web Audio API synthesizer chimes/clicks
│   │   └── useScrollGradient.js # Dynamic theme scroll-blender hook
│   ├── App.jsx                 # Root layout and global listeners
│   └── main.jsx                # Entrypoint mounting React DOM
├── tailwind.config.js          # Tailwind class maps and core custom color binds
├── vite.config.js              # Vite compiler server settings
└── package.json                # Project dependencies and scripting
```

---

## 🚀 Getting Started

If you want to run this project locally on your machine, follow these beginner-friendly steps:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or above recommended).

### 2. Clone the Repository
```bash
git clone https://github.com/uzain6268/portfolio.git
cd portfolio
```

### 3. Install Dependencies
Run the install command to fetch all required libraries:
```bash
npm install
```

### 4. Start Development Server
Launch the local server to run and edit the website live:
```bash
npm run dev
```
Open the URL printed in the terminal (usually `http://localhost:5173`) in your web browser.

### 5. Build for Production
To compile the site into optimized, compressed static files:
```bash
npm run build
```
The compiled build output will be stored inside the `/dist` folder, ready for deployment on platforms like Vercel, Netlify, or GitHub Pages.

---

## 🎨 Personalizing & Customizing

You can easily adapt this portfolio to highlight your own skills and background:

1.  **Changing Bio & Narrative:**
    Open `src/sections/About.jsx` and `src/sections/Hero.jsx` to update the introductory statements, focus zones, or goals.
2.  **Updating Projects Catalog:**
    Open `src/data/projects.js` and modify the name, descriptions, category tags, and repository links.
3.  **Updating Academic Timeline:**
    Open `src/data/education.js` to modify your degrees, schools, and approaches.
4.  **Expanding the Chatbot:**
    To add new queries/answers, open `src/utils/aiAgent.js` and append matching keyword rules to the responder data structure.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use the source code as inspiration or a boilerplate for your own interactive web projects!

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAiResponse } from '../../utils/aiAgent';

const BOOT_MESSAGES = [
  'ZAIN-OS [Version 1.0.4]',
  '(c) 2026 Zain Ul Abideen. All systems operational.',
  '',
  "Type 'help' to view available operations.",
  '',
  '⚡ SECRET COMMANDS: Try matrix, hack, glitch, snake, sudo',
  '⌨  Press Ctrl+K anywhere to open the Command Palette',
  ''
];

// Hack simulation log lines
const HACK_SEQUENCE = [
  { text: '[*] Initializing stealth reconnaissance module...', delay: 0 },
  { text: '[*] Scanning target: zain-os.local:443 ...', delay: 300 },
  { text: '[+] PORT 22/tcp   open   SSH        OpenSSH_9.2', delay: 600 },
  { text: '[+] PORT 80/tcp   open   HTTP       nginx/1.25.1', delay: 800 },
  { text: '[+] PORT 443/tcp  open   HTTPS      TLS 1.3', delay: 1000 },
  { text: '[+] PORT 3306/tcp open   MySQL      8.0.34', delay: 1150 },
  { text: '[+] PORT 6379/tcp open   Redis      7.2.0', delay: 1300 },
  { text: '[*] Enumerating firewall rules...', delay: 1600 },
  { text: '[!] WAF detected: CloudFlare v4.12 — attempting bypass...', delay: 2000 },
  { text: '[+] Firewall bypass: SUCCESS (CVE-2024-XXXX)', delay: 2500 },
  { text: '[*] Injecting payload into /api/auth/session ...', delay: 2900 },
  { text: '[+] Session token extracted: eyJhbGciOiJIUzI1NiJ9...', delay: 3300 },
  { text: '[+] Privilege escalation: guest → root', delay: 3600 },
  { text: '[+] Database dump: 847 records extracted', delay: 3900 },
  { text: '[!] ALERT: Intrusion Detection System triggered!', delay: 4200 },
  { text: '[!] Connection terminated by remote host.', delay: 4500 },
  { text: '', delay: 4700 },
  { text: '  Just kidding — this is a portfolio, not a server. 😄', delay: 4900 },
  { text: "  But hey, you found a secret command! Type 'matrix' for another.", delay: 5200 },
];

// Snake game constants
const SNAKE_GRID = 20;
const SNAKE_CELL = 10;
const SNAKE_SPEED = 120;

const InteractiveConsole = () => {
  const [history, setHistory] = useState(() => {
    return BOOT_MESSAGES.map(msg => ({ text: msg, type: 'system' }));
  });
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [snakeActive, setSnakeActive] = useState(false);
  const [bypassGame, setBypassGame] = useState({
    active: false,
    stage: 1,
    attempts: 3,
  });

  const consoleEndRef = useRef(null);
  const inputRef = useRef(null);
  const snakeCanvasRef = useRef(null);
  const snakeStateRef = useRef(null);
  const snakeIntervalRef = useRef(null);
  const isInitialMount = useRef(true);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, snakeActive]);

  // Listen for commands dispatched from the Command Palette
  useEffect(() => {
    const handlePaletteCommand = (e) => {
      const cmd = e.detail;
      if (cmd) {
        setHistory(prev => [...prev, { text: `guest@zain-os:~$ ${cmd}`, type: 'command' }]);
        processCommand(cmd);
      }
    };
    window.addEventListener('palette-command', handlePaletteCommand);
    return () => window.removeEventListener('palette-command', handlePaletteCommand);
  }, [snakeActive]);

  // Handle focusing the hidden input on clicking the console
  const handleConsoleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Snake game logic
  const startSnakeGame = useCallback(() => {
    setSnakeActive(true);
    setHistory(prev => [
      ...prev,
      { text: '🐍 SNAKE GAME LOADED — Use arrow keys to play. ESC to quit.', type: 'easter' },
    ]);

    // Initialize state after canvas mounts
    setTimeout(() => {
      const canvas = snakeCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = SNAKE_GRID * SNAKE_CELL;
      canvas.height = SNAKE_GRID * SNAKE_CELL;

      // Place initial snake in center
      const mid = Math.floor(SNAKE_GRID / 2);
      snakeStateRef.current = {
        snake: [
          { x: mid, y: mid },
          { x: mid - 1, y: mid },
          { x: mid - 2, y: mid },
        ],
        dir: { x: 1, y: 0 },
        nextDir: { x: 1, y: 0 },
        food: spawnFood([{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }]),
        score: 0,
        gameOver: false,
      };

      // Start game loop
      if (snakeIntervalRef.current) clearInterval(snakeIntervalRef.current);
      snakeIntervalRef.current = setInterval(() => {
        tickSnake(ctx);
      }, SNAKE_SPEED);

      canvas.focus();
    }, 100);
  }, []);

  const spawnFood = (snake) => {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * SNAKE_GRID),
        y: Math.floor(Math.random() * SNAKE_GRID),
      };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  };

  const tickSnake = (ctx) => {
    const state = snakeStateRef.current;
    if (!state || state.gameOver) return;

    // Apply queued direction
    state.dir = { ...state.nextDir };

    // Move snake
    const head = {
      x: state.snake[0].x + state.dir.x,
      y: state.snake[0].y + state.dir.y,
    };

    // Wall collision
    if (head.x < 0 || head.x >= SNAKE_GRID || head.y < 0 || head.y >= SNAKE_GRID) {
      endSnakeGame(state.score);
      return;
    }

    // Self collision
    if (state.snake.some(s => s.x === head.x && s.y === head.y)) {
      endSnakeGame(state.score);
      return;
    }

    state.snake.unshift(head);

    // Check food collision
    if (head.x === state.food.x && head.y === state.food.y) {
      state.score++;
      state.food = spawnFood(state.snake);
    } else {
      state.snake.pop();
    }

    // Draw
    drawSnake(ctx, state);
  };

  const drawSnake = (ctx, state) => {
    const w = SNAKE_GRID * SNAKE_CELL;
    const h = SNAKE_GRID * SNAKE_CELL;

    // Background
    ctx.fillStyle = '#0D1315';
    ctx.fillRect(0, 0, w, h);

    // Grid lines (very subtle)
    ctx.strokeStyle = 'rgba(39, 51, 56, 0.5)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= SNAKE_GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * SNAKE_CELL, 0);
      ctx.lineTo(i * SNAKE_CELL, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * SNAKE_CELL);
      ctx.lineTo(w, i * SNAKE_CELL);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff4060';
    ctx.shadowColor = '#ff4060';
    ctx.shadowBlur = 8;
    ctx.fillRect(
      state.food.x * SNAKE_CELL + 1,
      state.food.y * SNAKE_CELL + 1,
      SNAKE_CELL - 2,
      SNAKE_CELL - 2
    );
    ctx.shadowBlur = 0;

    // Snake body
    state.snake.forEach((seg, idx) => {
      if (idx === 0) {
        // Head — bright green
        ctx.fillStyle = '#9CB080';
        ctx.shadowColor = '#9CB080';
        ctx.shadowBlur = 6;
      } else {
        // Body — darker gradient
        const fade = 1 - (idx / state.snake.length) * 0.6;
        ctx.fillStyle = `rgba(156, 176, 128, ${fade})`;
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(
        seg.x * SNAKE_CELL + 1,
        seg.y * SNAKE_CELL + 1,
        SNAKE_CELL - 2,
        SNAKE_CELL - 2
      );
    });
    ctx.shadowBlur = 0;

    // Score
    ctx.fillStyle = '#738587';
    ctx.font = '10px "Space Mono", monospace';
    ctx.fillText(`SCORE: ${state.score}`, 4, h - 4);
  };

  const endSnakeGame = (score) => {
    const state = snakeStateRef.current;
    if (state) state.gameOver = true;
    if (snakeIntervalRef.current) {
      clearInterval(snakeIntervalRef.current);
      snakeIntervalRef.current = null;
    }
    setSnakeActive(false);
    setHistory(prev => [
      ...prev,
      { text: `💀 GAME OVER — Final Score: ${score}`, type: score >= 10 ? 'success' : 'danger' },
      { text: score >= 10
        ? '  Impressive reflexes. You should put that on your resume.'
        : "  Better luck next time. Type 'snake' to try again.", type: 'easter' },
    ]);
  };

  const handleSnakeKeyDown = useCallback((e) => {
    const state = snakeStateRef.current;
    if (!state || state.gameOver) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      endSnakeGame(state.score);
      return;
    }

    const keyMap = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };

    const newDir = keyMap[e.key];
    if (newDir) {
      e.preventDefault();
      // Prevent reverse direction
      if (newDir.x !== -state.dir.x || newDir.y !== -state.dir.y) {
        state.nextDir = newDir;
      }
    }
  }, []);

  // Cleanup snake on unmount
  useEffect(() => {
    return () => {
      if (snakeIntervalRef.current) clearInterval(snakeIntervalRef.current);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = inputVal.trim();
      if (!command) return;

      // Add command to log history
      setHistory(prev => [...prev, { text: `guest@zain-os:~$ ${command}`, type: 'command' }]);
      setCmdHistory(prev => [command, ...prev]);
      setHistoryIdx(-1);
      setInputVal('');

      // Process command
      processCommand(command.toLowerCase());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const handleBypassGuess = (guess) => {
    const stageInfo = {
      1: { word: 'lattice', scrambled: 'CTAITEL', clue: "7-letter word representing Zain's 3D background node mesh." },
      2: { word: 'monospace', scrambled: 'EAPCSOMNO', clue: "9-letter font type representing this hacker console terminal." },
      3: { word: 'gradient', scrambled: 'TINERGAD', clue: "8-letter mathematical slope direction optimization algorithm." }
    };

    const current = stageInfo[bypassGame.stage];
    if (!current) return;

    if (guess === current.word) {
      if (bypassGame.stage < 3) {
        const nextStage = bypassGame.stage + 1;
        const nextInfo = stageInfo[nextStage];
        setBypassGame({
          active: true,
          stage: nextStage,
          attempts: 3
        });
        setHistory(prev => [
          ...prev,
          { text: `guest@zain-os:~$ ${guess}`, type: 'command' },
          { text: `[+] STAGE ${bypassGame.stage} BYPASSED: SUCCESS!`, type: 'success' },
          { text: '--------------------------------------------------', type: 'system' },
          { text: `STAGE ${nextStage}/3: Decrypt Security Node Port.`, type: 'system' },
          { text: `Clue: ${nextInfo.clue}`, type: 'output' },
          { text: `Scrambled key: "${nextInfo.scrambled}"`, type: 'easter' },
          { text: `Attempts remaining: 3`, type: 'output' },
          { text: `Type guess (or 'exit' to quit):`, type: 'system' }
        ]);
      } else {
        setBypassGame({ active: false, stage: 1, attempts: 3 });
        setHistory(prev => [
          ...prev,
          { text: `guest@zain-os:~$ ${guess}`, type: 'command' },
          { text: `[+] STAGE 3 BYPASSED: SUCCESS!`, type: 'success' },
          { text: '--------------------------------------------------', type: 'system' },
          { text: '🔓 ACCESS GRANTED -- CORE FIREWALL BYPASSED!', type: 'success' },
          { text: '[+] Congratulations! You have successfully decrypted all core matrices.', type: 'success' },
          { text: '[+] Systems initialized. Dynamic color coordinates synced.', type: 'output' },
          { text: '[+] Hidden developer log unlocked:', type: 'system' },
          { text: '    "Building intelligent software from first principles."', type: 'easter' },
          { text: '--------------------------------------------------', type: 'system' },
          { text: 'Exiting secure bypass system... System visual glitch active.', type: 'danger' }
        ]);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('easter-egg-glitch'));
        }, 600);
      }
    } else {
      const remaining = bypassGame.attempts - 1;
      if (remaining > 0) {
        setBypassGame(prev => ({ ...prev, attempts: remaining }));
        setHistory(prev => [
          ...prev,
          { text: `guest@zain-os:~$ ${guess}`, type: 'command' },
          { text: `[-] DECRYPTION FAILED. Invalid hash.`, type: 'danger' },
          { text: `Attempts remaining: ${remaining}`, type: 'output' }
        ]);
      } else {
        setBypassGame({ active: false, stage: 1, attempts: 3 });
        setHistory(prev => [
          ...prev,
          { text: `guest@zain-os:~$ ${guess}`, type: 'command' },
          { text: `[-] CRITICAL ERROR: Security lock triggered. Decryption failed.`, type: 'danger' },
          { text: 'Exiting secure bypass system.', type: 'system' }
        ]);
      }
    }
  };

  const processCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    
    if (bypassGame.active) {
      if (trimmed === 'exit' || trimmed === 'quit') {
        setBypassGame({ active: false, stage: 1, attempts: 3 });
        setHistory(prev => [
          ...prev,
          { text: 'SYSTEM BYPASS DEACTIVATED. Resetting security blocks.', type: 'system' }
        ]);
        return;
      }
      handleBypassGuess(trimmed);
      return;
    }
    const parts = trimmed.split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        setHistory(prev => [
          ...prev,
          { text: 'Available commands:', type: 'system' },
          { text: '  about        - Learn about Zain\'s background', type: 'output' },
          { text: '  skills       - View technical competencies matrix', type: 'output' },
          { text: '  projects     - List core software engineering projects', type: 'output' },
          { text: '  contact      - Display social channels and contact options', type: 'output' },
          { text: '  download-cv  - Fetch Zain\'s resume document', type: 'output' },
          { text: '  theme [name] - Switch accent colors (presets: dynamic, neon, sage, cyber, graphite)', type: 'output' },
          { text: '  ask-zain [q] - Consult the AI Agent about Zain\'s projects or experience', type: 'output' },
          { text: '  cyber-bypass - Start interactive decryption game challenge', type: 'output' },
          { text: '  clear        - Clear the screen buffer', type: 'output' },
          { text: '  help         - Show this manual page', type: 'output' }
        ]);
        break;
      case 'about':
        setHistory(prev => [
          ...prev,
          { text: 'Zain Ul Abideen -- BS Computer Science Student at FAST-NUCES Islamabad.', type: 'output' },
          { text: 'Focus zones: Generative AI, Machine Learning, and Automation.', type: 'output' },
          { text: 'Enjoys coding core mechanisms from scratch (custom game loops, optimization graphs, regression math).', type: 'output' }
        ]);
        break;
      case 'skills':
        setHistory(prev => [
          ...prev,
          { text: 'ZAIN CORE SKILLS MATRIX', type: 'system' },
          { text: '-------------------------------------------------------------', type: 'system' },
          { text: '  [PROGRAMMING]   C++, Python, JavaScript (ES6+), HTML5/CSS3', type: 'output' },
          { text: '  [DATA & MATH]   Graph Networks, Optimization, Calculus', type: 'output' },
          { text: '  [AI / AGENTS]   LLM workflows, Automation Scripts, LangChain', type: 'output' },
          { text: '  [TOOLS & INFRA] Git, Docker, Node.js, Linux CLI', type: 'output' },
          { text: '-------------------------------------------------------------', type: 'system' }
        ]);
        break;
      case 'projects':
        setHistory(prev => [
          ...prev,
          { text: 'ZAIN CORE PROJECT DEPLOYMENTS', type: 'system' },
          { text: '----------------------------------------------------------------------', type: 'system' },
          { text: '  PROJECT NAME             ROLE / DESCRIPTION         LINK', type: 'system' },
          { text: '  ----------------------------------------------------------------------', type: 'system' },
          { text: '  CPI Dynamics             Graph-Vector Modeling      [GitHub / LinkedIn]', type: 'output' },
          { text: '  Gradient Descent         3D Optimization Schematic  [Live Demo]', type: 'output' },
          { text: '  Latency Optimizer        Stretched Routing Graph    [Technical Report]', type: 'output' },
          { text: '  Metal Slug Engine        C++/SFML Bounding Collider [GitHub]', type: 'output' },
          { text: '  Tumble Pop               Physics Particle Vortex    [GitHub]', type: 'output' },
          { text: '  ----------------------------------------------------------------------', type: 'system' },
          { text: "  * Type 'contact' or scroll above to access live URLs.", type: 'system' }
        ]);
        break;
      case 'contact':
        setHistory(prev => [
          ...prev,
          { text: 'COMMUNICATIONS CHANNELS:', type: 'system' },
          { text: '-------------------------------------------------------------', type: 'system' },
          { text: '  Gmail      : uzain6268@gmail.com', type: 'output' },
          { text: '  GitHub     : github.com/uzain6268', type: 'output' },
          { text: '  LinkedIn   : linkedin.com/in/zain-ul-abideen-ai', type: 'output' },
          { text: '-------------------------------------------------------------', type: 'system' }
        ]);
        break;
      case 'download-cv':
        setHistory(prev => [
          ...prev,
          { text: 'Initializing download request...', type: 'system' },
          { text: 'Asset resolved: /Zain_Ul_Abideen_CV.docx', type: 'output' },
          { text: 'Transfer complete. File saved to downloads directory.', type: 'output' }
        ]);
        triggerCVDownload();
        break;
      case 'clear':
        setHistory([]);
        break;

      // ========================
      // 🎮 EASTER EGG COMMANDS
      // ========================

      case 'matrix':
        setHistory(prev => [
          ...prev,
          { text: '🔴 ENTERING THE MATRIX...', type: 'easter' },
          { text: '  "Unfortunately, no one can be told what the Matrix is."', type: 'easter' },
          { text: '  "You have to see it for yourself."', type: 'easter' },
        ]);
        // Dispatch custom event for App.jsx to mount MatrixRain
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('easter-egg-matrix'));
        }, 600);
        break;

      case 'hack':
        setHistory(prev => [
          ...prev,
          { text: '⚠️  INITIATING PENETRATION TEST MODULE...', type: 'danger' },
        ]);
        // Stagger-print hack log lines
        HACK_SEQUENCE.forEach(({ text, delay }) => {
          setTimeout(() => {
            setHistory(prev => [
              ...prev,
              {
                text,
                type: text.startsWith('[!]') ? 'danger'
                  : text.startsWith('[+]') ? 'success'
                  : text.startsWith('  ') ? 'easter'
                  : 'output',
              },
            ]);
          }, delay);
        });
        break;

      case 'glitch':
        setHistory(prev => [
          ...prev,
          { text: '⚡ SYSTEM INSTABILITY DETECTED — VISUAL CORTEX CORRUPTED', type: 'danger' },
          { text: '  Applying chromatic aberration distortion for 3 seconds...', type: 'easter' },
        ]);
        // Dispatch custom event for App.jsx to apply glitch class
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('easter-egg-glitch'));
        }, 400);
        break;

      case 'snake':
        if (snakeActive) {
          setHistory(prev => [
            ...prev,
            { text: 'Snake game is already running! Use arrow keys to play.', type: 'system' },
          ]);
        } else {
          startSnakeGame();
        }
        break;

      case 'sudo':
        setHistory(prev => [
          ...prev,
          { text: '🔒 ACCESS DENIED', type: 'danger' },
          { text: '', type: 'output' },
          { text: '  ╔══════════════════════════════════════════════════╗', type: 'danger' },
          { text: '  ║  UNAUTHORIZED PRIVILEGE ESCALATION ATTEMPT      ║', type: 'danger' },
          { text: '  ║  Your IP has been logged.                       ║', type: 'danger' },
          { text: '  ║  Incident reported to: /dev/null                ║', type: 'danger' },
          { text: '  ║                                                 ║', type: 'danger' },
          { text: '  ║  Just kidding. You have no power here. 😎       ║', type: 'easter' },
          { text: '  ╚══════════════════════════════════════════════════╝', type: 'danger' },
          { text: '', type: 'output' },
          { text: "  Hint: Try 'matrix', 'hack', 'glitch', 'snake', or 'cyber-bypass'.", type: 'easter' },
        ]);
        break;

      case 'theme': {
        const themeName = parts[1];
        const validThemes = ['dynamic', 'neon', 'sage', 'cyber', 'graphite'];
        if (validThemes.includes(themeName)) {
          window.dispatchEvent(new CustomEvent('change-theme', { detail: themeName }));
          setHistory(prev => [
            ...prev,
            { text: `guest@zain-os:~$ ${cmd}`, type: 'command' },
            { text: `[+] System theme successfully locked to: ${themeName.toUpperCase()}`, type: 'success' }
          ]);
        } else {
          setHistory(prev => [
            ...prev,
            { text: `guest@zain-os:~$ ${cmd}`, type: 'command' },
            { text: `[-] Invalid theme. Available presets: dynamic, neon, sage, cyber, graphite`, type: 'danger' }
          ]);
        }
        break;
      }

      case 'chat':
      case 'ask-zain': {
        const query = parts.slice(1).join(' ');
        if (!query) {
          setHistory(prev => [
            ...prev,
            { text: `guest@zain-os:~$ ${cmd}`, type: 'command' },
            { text: `[-] Usage: ask-zain [question] (e.g. 'ask-zain projects')`, type: 'danger' }
          ]);
        } else {
          const aiAnswer = getAiResponse(query);
          setHistory(prev => [
            ...prev,
            { text: `guest@zain-os:~$ ${cmd}`, type: 'command' },
            { text: `[Decrypting AI Core...]`, type: 'easter' },
            { text: aiAnswer, type: 'success' }
          ]);
        }
        break;
      }

      case 'cyber-bypass':
        setBypassGame({
          active: true,
          stage: 1,
          attempts: 3
        });
        setHistory(prev => [
          ...prev,
          { text: '🛡️ SECURE DATABASE ENCRYPTION BYPASS SYSTEM', type: 'system' },
          { text: '--------------------------------------------------', type: 'system' },
          { text: 'STAGE 1/3: Decrypt Node Port Access Code.', type: 'system' },
          { text: 'Clue: 7-letter word representing Zain\'s 3D background node mesh.', type: 'output' },
          { text: 'Scrambled key: "CTAITEL"', type: 'easter' },
          { text: 'Attempts remaining: 3', type: 'output' },
          { text: "Type guess (or 'exit' to quit):", type: 'system' }
        ]);
        break;

      default:
        setHistory(prev => [
          ...prev,
          { text: `bash: command not found: ${mainCmd}. Type 'help' for options.`, type: 'system' }
        ]);
    }
  };

  const triggerCVDownload = () => {
    const link = document.createElement('a');
    link.href = '/Zain_Ul_Abideen_CV.docx';
    link.download = 'Zain_Ul_Abideen_CV.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      onClick={handleConsoleClick}
      className="glass-card bg-bgDark/90 border border-cardBorder rounded-sm p-4 w-full max-w-3xl mx-auto font-mono text-[11px] leading-relaxed text-textMuted text-left cursor-text select-text h-[280px] flex flex-col justify-between"
    >
      {/* Console Window Header Controls */}
      <div className="flex justify-between items-center border-b border-cardBorder pb-2 mb-2 select-none pointer-events-none">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="text-[10px] text-textMuted tracking-wider uppercase font-bold">
          [guest@zain-os: ~] // SYSTEM INTERACTION SHELL
        </div>
      </div>

      {/* Console Terminal Screen Log */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cardBorder">
        {history.map((line, idx) => {
          let lineClass = 'text-textMuted';
          if (line.type === 'command') {
            lineClass = 'text-textPrimary font-semibold';
          } else if (line.type === 'system') {
            lineClass = 'text-accentPurple';
          } else if (line.type === 'output') {
            lineClass = 'text-accentCyan'; // Dynamic secondary accent for terminal output
          } else if (line.type === 'easter') {
            lineClass = 'text-amber-400'; // Golden amber for easter egg text
          } else if (line.type === 'success') {
            lineClass = 'text-emerald-400 font-semibold'; // Bright green for success
          } else if (line.type === 'danger') {
            lineClass = 'text-red-400 font-semibold'; // Red for danger/warnings
          }
          return (
            <div key={idx} className={`${lineClass} whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}

        {/* Snake Game Canvas */}
        {snakeActive && (
          <div className="flex justify-center py-2">
            <canvas
              ref={snakeCanvasRef}
              tabIndex={0}
              onKeyDown={handleSnakeKeyDown}
              className="border border-cardBorder rounded-sm outline-none"
              style={{
                width: SNAKE_GRID * SNAKE_CELL,
                height: SNAKE_GRID * SNAKE_CELL,
                imageRendering: 'pixelated',
              }}
            />
          </div>
        )}

        <div ref={consoleEndRef} />
      </div>

      {/* Input Prompter */}
      <div className="flex items-center pt-2 border-t border-cardBorder select-none mt-2">
        <span className="text-textPrimary font-bold mr-2">guest@zain-os:~$</span>
        <div className="flex-1 flex items-center relative">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-accentPurple caret-transparent font-mono text-[11px]"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {/* Custom Blinking Caret Cursor */}
          <span 
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none w-1.5 h-3.5 bg-accentPurple animate-pulse"
            style={{ 
              left: `${Math.min(inputVal.length * 6.6, inputRef.current?.getBoundingClientRect().width || 0)}px` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveConsole;

import { useEffect, useRef } from 'react';

// ─── CODE SNIPPETS ──────────────────────────────────────────────
const CODE_SNIPPETS = [
  [
    '# Neural Network Training Pipeline',
    'import torch',
    'import torch.nn as nn',
    'from torch.optim import Adam',
    '',
    'class NeuralNet(nn.Module):',
    '    def __init__(self, input_dim, hidden):',
    '        super().__init__()',
    '        self.layers = nn.Sequential(',
    '            nn.Linear(input_dim, hidden),',
    '            nn.ReLU(),',
    '            nn.Dropout(0.3),',
    '            nn.Linear(hidden, 1),',
    '            nn.Sigmoid()',
    '        )',
    '',
    '    def forward(self, x):',
    '        return self.layers(x)',
    '',
    'model = NeuralNet(512, 256)',
    'optimizer = Adam(model.parameters())',
  ],
  [
    '// Entity Component System',
    '#include <SFML/Graphics.hpp>',
    '#include <vector>',
    '#include <memory>',
    '',
    'class GameObject {',
    'private:',
    '    sf::Sprite sprite;',
    '    sf::Vector2f velocity;',
    '    bool isActive = true;',
    '',
    'public:',
    '    virtual void update(float dt) {',
    '        sprite.move(velocity * dt);',
    '        checkBounds();',
    '    }',
    '',
    '    void render(sf::RenderWindow& w) {',
    '        if (isActive)',
    '            w.draw(sprite);',
    '    }',
    '',
    '    void applyForce(sf::Vector2f f) {',
    '        velocity += f;',
    '    }',
    '};',
  ],
  [
    '// React Three Fiber Controller',
    "import { useFrame } from '@react-three/fiber';",
    "import { useRef, useMemo } from 'react';",
    '',
    'const ParticleField = ({ count }) => {',
    '  const meshRef = useRef();',
    '',
    '  const particles = useMemo(() => {',
    '    const pos = new Float32Array(count*3);',
    '    for (let i = 0; i < count; i++) {',
    '      pos[i*3] = (Math.random()-.5)*10;',
    '      pos[i*3+1] = (Math.random()-.5)*10;',
    '      pos[i*3+2] = (Math.random()-.5)*10;',
    '    }',
    '    return pos;',
    '  }, [count]);',
    '',
    '  useFrame((state) => {',
    '    meshRef.current.rotation.y =',
    '      state.clock.elapsedTime * 0.1;',
    '  });',
    '',
    '  return <points ref={meshRef} />;',
    '};',
  ],
  [
    '# Graph Network Analysis',
    'import networkx as nx',
    'import numpy as np',
    'from sklearn.metrics.pairwise import (',
    '    cosine_similarity',
    ')',
    '',
    'def build_graph(data, thresh=0.7):',
    '    n = len(data)',
    '    G = nx.Graph()',
    '',
    '    for i in range(n):',
    "        G.add_node(i, label=data[i]['n'])",
    '        for j in range(i+1, n):',
    '            sim = cosine_similarity(',
    "                [data[i]['vec']],",
    "                [data[j]['vec']]",
    '            )[0][0]',
    '            if sim > thresh:',
    '                G.add_edge(i, j, w=sim)',
    '',
    '    c = nx.betweenness_centrality(G)',
    '    return G, c',
  ],
];

// ─── SYNTAX COLORS ──────────────────────────────────────────────
const KEYWORDS = new Set([
  'import','from','class','def','return','if','for','while',
  'const','let','var','function','virtual','void','public',
  'private','bool','float','int','true','false','new',
  'include','using','super','self','this','export','default',
]);

function getCharColor(line, charIdx) {
  const trimmed = line.trim();
  // Comments
  if (trimmed.startsWith('//') || trimmed.startsWith('#')) return '#9CB080';
  // Strings
  const ch = line[charIdx];
  if (ch === '"' || ch === "'") return '#B8A472';
  // Try to detect if char is inside a keyword
  // Simple: find the word this char belongs to
  let wordStart = charIdx;
  while (wordStart > 0 && /[a-zA-Z_]/.test(line[wordStart - 1])) wordStart--;
  let wordEnd = charIdx;
  while (wordEnd < line.length && /[a-zA-Z_]/.test(line[wordEnd])) wordEnd++;
  const word = line.slice(wordStart, wordEnd);
  if (KEYWORDS.has(word)) return '#7FAF82';
  // Numbers
  if (/\d/.test(ch)) return '#8FAAAB';
  // Default
  return '#5A7A7D';
}

// ─── TERMINAL COLUMN STATE ──────────────────────────────────────
function createColumn(x, y, w, h, snippetIdx, fontSize) {
  return {
    x, y, w, h,
    snippetIdx: snippetIdx % CODE_SNIPPETS.length,
    lineIdx: 0,
    charIdx: 0,
    typed: [], // array of strings per completed line
    currentTyped: '',
    timer: 0,
    speed: 28 + Math.random() * 20, // ms per char
    pauseTimer: 0,
    blinkTimer: 0,
    cursorOn: true,
    fontSize,
    lineHeight: fontSize * 1.7,
  };
}

function tickColumn(col, dt) {
  const snippet = CODE_SNIPPETS[col.snippetIdx];

  // Cursor blink
  col.blinkTimer += dt;
  if (col.blinkTimer > 530) {
    col.cursorOn = !col.cursorOn;
    col.blinkTimer = 0;
  }

  // Pause between snippets
  if (col.pauseTimer > 0) {
    col.pauseTimer -= dt;
    if (col.pauseTimer <= 0) {
      col.snippetIdx = (col.snippetIdx + 1) % CODE_SNIPPETS.length;
      col.lineIdx = 0;
      col.charIdx = 0;
      col.typed = [];
      col.currentTyped = '';
    }
    return;
  }

  // Typing
  col.timer += dt;
  if (col.timer >= col.speed) {
    col.timer = 0;
    const line = snippet[col.lineIdx];
    if (line === undefined) {
      // All lines done, pause then next snippet
      col.pauseTimer = 2000;
      return;
    }
    if (col.charIdx < line.length) {
      col.currentTyped = line.slice(0, col.charIdx + 1);
      col.charIdx++;
    } else {
      // Line finished
      col.typed.push(line);
      col.currentTyped = '';
      col.lineIdx++;
      col.charIdx = 0;
    }
  }
}

// ─── PARTICLE SYSTEM ────────────────────────────────────────────
function createParticles(count, w, h) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.35,
      pulse: Math.random() * Math.PI * 2,
    });
  }
  return particles;
}

function tickParticles(particles, w, h, dt) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.pulse += dt * 0.002;
    // Wrap around
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;
  }
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    const a = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(156, 176, 128, ${a})`;
    ctx.fill();
  }
  // Draw connections between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(156, 176, 128, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

// ─── GRID LAYER ─────────────────────────────────────────────────
function drawGrid(ctx, w, h, time) {
  const spacing = 60;
  const pulse = Math.sin(time * 0.0005) * 0.3 + 0.7;

  ctx.strokeStyle = `rgba(39, 51, 56, ${0.35 * pulse})`;
  ctx.lineWidth = 0.5;

  // Vertical lines
  for (let x = 0; x < w; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  // Horizontal lines
  for (let y = 0; y < h; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Bright intersection dots
  ctx.fillStyle = `rgba(97, 135, 100, ${0.12 * pulse})`;
  for (let x = 0; x < w; x += spacing) {
    for (let y = 0; y < h; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ─── SCANLINE SWEEP ─────────────────────────────────────────────
function drawScanline(ctx, w, h, time) {
  const sweepY = (time * 0.03) % (h + 200) - 100;
  const grad = ctx.createLinearGradient(0, sweepY - 60, 0, sweepY + 60);
  grad.addColorStop(0, 'rgba(156, 176, 128, 0)');
  grad.addColorStop(0.5, 'rgba(156, 176, 128, 0.03)');
  grad.addColorStop(1, 'rgba(156, 176, 128, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, sweepY - 60, w, 120);
}

// ─── HEX NODES (decorative data nodes) ──────────────────────────
function createHexNodes(count, w, h) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 8 + Math.random() * 14,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.0008,
      alpha: 0.04 + Math.random() * 0.06,
      pulseOffset: Math.random() * Math.PI * 2,
      label: Math.random() > 0.5
        ? `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`
        : `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    });
  }
  return nodes;
}

function drawHexNodes(ctx, nodes, time) {
  for (const n of nodes) {
    const pulse = Math.sin(time * 0.001 + n.pulseOffset) * 0.4 + 0.6;
    const alpha = n.alpha * pulse;

    ctx.save();
    ctx.translate(n.x, n.y);
    ctx.rotate(n.rotation + time * n.rotSpeed);

    // Draw hexagon outline
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = Math.cos(angle) * n.size;
      const py = Math.sin(angle) * n.size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(156, 176, 128, ${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Label text inside
    ctx.rotate(-(n.rotation + time * n.rotSpeed)); // un-rotate for readable text
    ctx.font = '7px "Space Mono", monospace';
    ctx.fillStyle = `rgba(156, 176, 128, ${alpha * 0.8})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.label, 0, 0);

    ctx.restore();
  }
}

// ─── DRAW TERMINAL COLUMNS ──────────────────────────────────────
function drawColumn(ctx, col) {
  const snippet = CODE_SNIPPETS[col.snippetIdx];
  const { x, y, fontSize, lineHeight } = col;

  ctx.font = `${fontSize}px "Space Mono", monospace`;

  // Draw completed lines
  col.typed.forEach((line, i) => {
    const ly = y + i * lineHeight;
    // Line number
    ctx.fillStyle = 'rgba(74, 94, 96, 0.6)';
    ctx.textAlign = 'right';
    ctx.fillText(`${i + 1}`, x + 20, ly);

    // Code characters
    ctx.textAlign = 'left';
    let cx = x + 30;
    for (let c = 0; c < line.length; c++) {
      ctx.fillStyle = getCharColor(line, c);
      ctx.fillText(line[c], cx, ly);
      cx += fontSize * 0.6;
    }
  });

  // Draw currently-typing line
  const curLineY = y + col.typed.length * lineHeight;
  const curLine = snippet[col.lineIdx];
  if (curLine !== undefined) {
    // Line number
    ctx.fillStyle = 'rgba(74, 94, 96, 0.6)';
    ctx.textAlign = 'right';
    ctx.fillText(`${col.typed.length + 1}`, x + 20, curLineY);

    // Typed characters
    ctx.textAlign = 'left';
    let cx = x + 30;
    for (let c = 0; c < col.currentTyped.length; c++) {
      ctx.fillStyle = getCharColor(curLine, c);
      ctx.fillText(col.currentTyped[c], cx, curLineY);
      cx += fontSize * 0.6;
    }

    // Blinking cursor
    if (col.cursorOn) {
      ctx.fillStyle = 'rgba(156, 176, 128, 0.8)';
      ctx.fillRect(cx + 1, curLineY - fontSize + 2, fontSize * 0.5, fontSize);
    }
  }

  // Future line numbers (dimmed placeholders)
  const futureStart = col.typed.length + 1;
  const totalVisible = snippet.length;
  for (let i = futureStart; i < totalVisible; i++) {
    const fy = y + i * lineHeight;
    ctx.fillStyle = 'rgba(74, 94, 96, 0.2)';
    ctx.textAlign = 'right';
    ctx.fillText(`${i + 1}`, x + 20, fy);
  }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function LiveTerminal() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rebuild state on resize
      initState();
    };

    const initState = () => {
      const isMobile = w < 768;
      const fontSize = isMobile ? 10 : 12;
      const lineHeight = fontSize * 1.7;

      // Create terminal columns spread across the screen
      const columns = [];
      if (isMobile) {
        // Single column on mobile, centered
        columns.push(createColumn(20, h * 0.15, w * 0.9, h * 0.7, 0, fontSize));
      } else {
        // 3 columns spread across desktop
        const colW = w * 0.28;
        columns.push(createColumn(w * 0.03, h * 0.08, colW, h * 0.5, 0, fontSize));
        columns.push(createColumn(w * 0.38, h * 0.35, colW, h * 0.5, 1, fontSize));
        columns.push(createColumn(w * 0.70, h * 0.12, colW, h * 0.5, 2, fontSize));
      }

      const particleCount = isMobile ? 25 : 60;
      const hexCount = isMobile ? 6 : 14;

      stateRef.current = {
        columns,
        particles: createParticles(particleCount, w, h),
        hexNodes: createHexNodes(hexCount, w, h),
        lastTime: performance.now(),
      };
    };

    resize();
    window.addEventListener('resize', resize);

    // ─── RENDER LOOP ──────────────────────────────────────────
    const render = (now) => {
      const state = stateRef.current;
      if (!state) {
        animRef.current = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min(now - state.lastTime, 100); // cap delta at 100ms
      state.lastTime = now;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Layer 1: Grid
      drawGrid(ctx, w, h, now);

      // Layer 2: Hex data nodes
      drawHexNodes(ctx, state.hexNodes, now);

      // Layer 3: Particle network
      tickParticles(state.particles, w, h, dt);
      drawParticles(ctx, state.particles);

      // Layer 4: Scanline sweep
      drawScanline(ctx, w, h, now);

      // Layer 5: Terminal columns
      for (const col of state.columns) {
        tickColumn(col, dt);
        drawColumn(ctx, col);
      }

      // Layer 6: CRT vignette
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.9);
      vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        opacity: 0.12,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}

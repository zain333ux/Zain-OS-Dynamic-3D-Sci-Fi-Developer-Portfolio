import { useState, useEffect, useRef, useCallback } from 'react';

// ─── SECTION MAP ────────────────────────────────────────────────
const SECTIONS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'education', label: 'EDU' },
  { id: 'stack', label: 'STACK' },
  { id: 'projects', label: 'PROJ' },
  { id: 'learning', label: 'LEARN' },
  { id: 'volunteering', label: 'VOL' },
  { id: 'achievements', label: 'ACHV' },
  { id: 'contact', label: 'CONT' },
];

// ─── RADAR CANVAS ───────────────────────────────────────────────
function RadarCanvas({ size = 56 }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 4;
    let raf;

    const draw = () => {
      const rootStyle = getComputedStyle(document.documentElement);
      const accentRGB = (rootStyle.getPropertyValue('--accent-dynamic-rgb') || '156, 176, 128').trim();

      ctx.clearRect(0, 0, size, size);

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${accentRGB}, 0.25)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Inner rings
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${accentRGB}, 0.12)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      // Cross lines
      ctx.strokeStyle = `rgba(${accentRGB}, 0.1)`;
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.stroke();

      // Sweep line
      angleRef.current += 0.02;
      const sx = cx + Math.cos(angleRef.current) * r;
      const sy = cy + Math.sin(angleRef.current) * r;

      // Sweep gradient trail
      const sweepGrad = ctx.createConicalGradient
        ? null
        : ctx.createLinearGradient(cx, cy, sx, sy);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `rgba(${accentRGB}, 0.6)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sweep fade arc
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angleRef.current - 0.5, angleRef.current, false);
      ctx.closePath();
      ctx.fillStyle = `rgba(${accentRGB}, 0.05)`;
      ctx.fill();

      // Blip dots (fake contacts)
      const blipAngle = angleRef.current * 0.3;
      const blipR = r * 0.5;
      const bx = cx + Math.cos(blipAngle + 1.2) * blipR;
      const by = cy + Math.sin(blipAngle + 1.2) * blipR;
      const blipAlpha = Math.max(0, Math.sin(angleRef.current - blipAngle - 1.2));

      if (blipAlpha > 0.1) {
        ctx.beginPath();
        ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRGB}, ${blipAlpha * 0.7})`;
        ctx.fill();
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentRGB}, 0.5)`;
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="opacity-60"
    />
  );
}

// ─── MINIMAP ────────────────────────────────────────────────────
function Minimap({ scrollPct, currentSection }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[7px] tracking-[0.2em] text-[#738587]/40 uppercase mb-1">MAP</span>
      <div className="relative w-1.5 h-32 bg-[#273338]/40 rounded-full overflow-hidden">
        {/* Section markers */}
        {SECTIONS.map((sec, i) => {
          const pct = (i / (SECTIONS.length - 1)) * 100;
          const isActive = sec.id === currentSection;
          return (
            <div
              key={sec.id}
              className="absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
              style={{
                top: `${pct}%`,
                width: isActive ? 5 : 3,
                height: isActive ? 5 : 3,
                background: isActive
                  ? 'var(--accent-dynamic)'
                  : 'rgba(115, 133, 135, 0.3)',
                boxShadow: isActive ? '0 0 6px var(--accent-dynamic-glow-strong)' : 'none',
              }}
            />
          );
        })}
        {/* Current position indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-accentPurple/50 transition-all duration-200"
          style={{
            top: `${scrollPct}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 8px var(--accent-dynamic-glow)',
          }}
        />
      </div>
    </div>
  );
}

// ─── EDGE BRACKETS ──────────────────────────────────────────────
function EdgeBrackets() {
  const bracketStyle = 'absolute pointer-events-none';
  const color = 'var(--accent-dynamic-glow, rgba(156, 176, 128, 0.15))';
  const len = 30;
  const w = 1;

  return (
    <>
      {/* Top-left */}
      <div className={bracketStyle} style={{ top: 12, left: 12 }}>
        <div style={{ width: len, height: w, background: color }} />
        <div style={{ width: w, height: len, background: color }} />
      </div>
      {/* Top-right */}
      <div className={bracketStyle} style={{ top: 12, right: 12 }}>
        <div style={{ width: len, height: w, background: color, marginLeft: 'auto' }} />
        <div style={{ width: w, height: len, background: color, marginLeft: 'auto' }} />
      </div>
      {/* Bottom-left */}
      <div className={bracketStyle} style={{ bottom: 12, left: 12, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ width: w, height: len, background: color }} />
        <div style={{ width: len, height: w, background: color }} />
      </div>
      {/* Bottom-right */}
      <div className={bracketStyle} style={{ bottom: 12, right: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        <div style={{ width: w, height: len, background: color, marginLeft: 'auto' }} />
        <div style={{ width: len, height: w, background: color, marginLeft: 'auto' }} />
      </div>
    </>
  );
}

// ─── MAIN HUD COMPONENT ────────────────────────────────────────
export default function HudOverlay() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [scrollPct, setScrollPct] = useState(0);
  const [currentSection, setCurrentSection] = useState('home');
  const [uptime, setUptime] = useState(0);
  const [cpuVal, setCpuVal] = useState(72);
  const [memVal, setMemVal] = useState(2.1);
  const [netLatency, setNetLatency] = useState(128);
  const startTime = useRef(Date.now());

  // Mouse tracking
  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Touch tracking for mobile HUD
  useEffect(() => {
    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        setTouchPos({
          x: Math.round(e.touches[0].clientX),
          y: Math.round(e.touches[0].clientY),
        });
      }
    };
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  // Scroll tracking + section detection
  useEffect(() => {
    const handleScroll = () => {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = totalH > 0 ? (window.scrollY / totalH) * 100 : 0;
      setScrollPct(Math.min(100, Math.max(0, pct)));

      // Detect current section
      let active = 'home';
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            active = sec.id;
          }
        }
      }
      setCurrentSection(active);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Uptime counter + fake system stats fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime.current) / 1000));
      setCpuVal(prev => Math.min(99, Math.max(45, prev + (Math.random() - 0.48) * 6)));
      setMemVal(prev => Math.min(6.2, Math.max(1.8, prev + (Math.random() - 0.5) * 0.15)));
      setNetLatency(prev => Math.min(280, Math.max(42, prev + Math.floor((Math.random() - 0.5) * 30))));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = useCallback((secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, []);

  const cpuBar = useCallback((val) => {
    const filled = Math.round(val / 12.5);
    return '█'.repeat(filled) + '▒'.repeat(8 - filled);
  }, []);

  const sectionLabel = SECTIONS.find(s => s.id === currentSection)?.label || 'HOME';

  return (
    <>
      {/* Desktop HUD */}
      <div
        className="fixed inset-0 z-20 pointer-events-none select-none hidden md:block"
        aria-hidden="true"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        <EdgeBrackets />

        {/* ─── TOP-LEFT: Coordinates Tracker ──────────────────── */}
        <div className="absolute top-20 left-5 text-[9px] leading-relaxed tracking-wider text-[#738587]/50 space-y-0.5">
          <div>
            <span className="text-accentPurple/40">X:</span>{' '}
            <span className="text-[#738587]/60 tabular-nums">{String(mousePos.x).padStart(4, ' ')}</span>
            {'  '}
            <span className="text-accentPurple/40">Y:</span>{' '}
            <span className="text-[#738587]/60 tabular-nums">{String(mousePos.y).padStart(4, ' ')}</span>
          </div>
          <div>
            <span className="text-accentPurple/40">SCROLL:</span>{' '}
            <span className="text-[#738587]/60 tabular-nums">{scrollPct.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-accentPurple/40">SECTION:</span>{' '}
            <span className="text-accentPurple/50 font-bold">{sectionLabel}</span>
          </div>
          <div className="mt-1 text-[7px] text-[#738587]/30">
            ── VIEWPORT ──
          </div>
          <div className="text-[8px] text-[#738587]/30">
            {window.innerWidth}x{window.innerHeight}
          </div>
        </div>

        {/* ─── TOP-RIGHT: System Vitals ───────────────────────── */}
        <div className="absolute top-20 right-5 text-[9px] leading-relaxed tracking-wider text-[#738587]/50 text-right space-y-0.5">
          <div>
            <span className="text-accentPurple/40">CPU:</span>{' '}
            <span className="text-[#738587]/50 tabular-nums">{Math.round(cpuVal)}%</span>{' '}
            <span className="text-accentPurple/30 text-[8px]">{cpuBar(cpuVal)}</span>
          </div>
          <div>
            <span className="text-accentPurple/40">MEM:</span>{' '}
            <span className="text-[#738587]/50 tabular-nums">{memVal.toFixed(1)}GB</span>{' '}
            <span className="text-[#738587]/30">/ 8GB</span>
          </div>
          <div>
            <span className="text-accentPurple/40">NET:</span>{' '}
            <span className={`tabular-nums ${netLatency < 100 ? 'text-accentCyan/50' : netLatency < 200 ? 'text-yellow-500/50' : 'text-red-400/40'}`}>
              {netLatency}ms
            </span>
          </div>
          <div>
            <span className="text-accentPurple/40">UPTIME:</span>{' '}
            <span className="text-[#738587]/50 tabular-nums">{formatUptime(uptime)}</span>
          </div>
          <div className="mt-1 text-[7px] text-[#738587]/30 tracking-[0.15em]">
            ── ZAIN-OS v1.0 ──
          </div>
        </div>

        {/* ─── BOTTOM-LEFT: Minimap ───────────────────────────── */}
        <div className="absolute bottom-8 left-5">
          <Minimap scrollPct={scrollPct} currentSection={currentSection} />
        </div>

        {/* ─── BOTTOM-RIGHT: Radar ────────────────────────────── */}
        <div className="absolute bottom-6 right-5 flex flex-col items-center gap-1">
          <RadarCanvas size={56} />
          <span className="text-[7px] tracking-[0.2em] text-[#738587]/30 uppercase">SCAN</span>
        </div>

        {/* ─── LEFT EDGE: Scroll Ticks ────────────────────────── */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {Array.from({ length: 8 }, (_, i) => {
            const tickPct = (i / 7) * 100;
            const isNear = Math.abs(scrollPct - tickPct) < 10;
            return (
              <div
                key={i}
                className="transition-all duration-300"
                style={{
                  width: isNear ? 12 : 6,
                  height: 1,
                  background: isNear
                    ? 'var(--accent-dynamic)'
                    : 'rgba(115, 133, 135, 0.15)',
                  opacity: isNear ? 0.8 : 0.25,
                }}
              />
            );
          })}
        </div>

        {/* ─── RIGHT EDGE: Data Ticks ─────────────────────────── */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {Array.from({ length: 8 }, (_, i) => {
            const tickPct = (i / 7) * 100;
            const isNear = Math.abs(scrollPct - tickPct) < 10;
            return (
              <div
                key={i}
                className="transition-all duration-300 ml-auto"
                style={{
                  width: isNear ? 12 : 6,
                  height: 1,
                  background: isNear
                    ? 'var(--accent-dynamic)'
                    : 'rgba(115, 133, 135, 0.15)',
                  opacity: isNear ? 0.8 : 0.25,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile HUD Widget */}
      <div 
        className="fixed top-20 right-4 z-40 md:hidden font-mono text-[9px] bg-bgDark/80 border border-cardBorder rounded p-2 text-textMuted/70 space-y-1.5 backdrop-blur-md shadow-lg pointer-events-none select-none w-[110px]"
        style={{ borderColor: 'rgba(var(--accent-dynamic-rgb), 0.3)' }}
      >
        <div className="flex items-center gap-1.5 border-b border-cardBorder/40 pb-1 text-[8px]">
          <span 
            className="w-1 h-1 bg-accentCyan rounded-full animate-pulse" 
            style={{ backgroundColor: 'var(--accent-dynamic)' }} 
          />
          <span 
            className="text-textMuted/70 font-bold uppercase tracking-wider" 
            style={{ color: 'var(--accent-dynamic)' }}
          >
            SYS_HUD
          </span>
        </div>
        <div>
          <span className="text-textMuted/40">T_X:</span>{' '}
          <span className="text-textPrimary font-bold tabular-nums">{touchPos.x}</span>
        </div>
        <div>
          <span className="text-textMuted/40">T_Y:</span>{' '}
          <span className="text-textPrimary font-bold tabular-nums">{touchPos.y}</span>
        </div>
        <div>
          <span className="text-textMuted/40">SCR:</span>{' '}
          <span className="text-textPrimary font-bold tabular-nums">{scrollPct.toFixed(0)}%</span>
        </div>
        <div>
          <span className="text-textMuted/40">CPU:</span>{' '}
          <span className="text-textPrimary font-bold tabular-nums">{Math.round(cpuVal)}%</span>
        </div>
      </div>
    </>
  );
}

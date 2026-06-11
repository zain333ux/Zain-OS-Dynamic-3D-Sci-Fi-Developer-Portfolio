import { useEffect, useRef } from 'react';

export default function NebulaBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, dpr;
    let raf;
    let stars = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Generate star field
      stars = [];
      const starCount = Math.min(200, Math.floor((w * h) / 8000));
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.4 + 0.1,
          twinkleSpeed: 0.001 + Math.random() * 0.003,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // ─── NEBULA CLOUDS ──────────────────────────────────────
    const clouds = [
      {
        x: w * 0.2, y: h * 0.3,
        rx: w * 0.5, ry: h * 0.4,
        color: [15, 25, 50], // Deep navy
        driftX: 0.08, driftY: 0.05,
        phase: 0,
      },
      {
        x: w * 0.7, y: h * 0.6,
        rx: w * 0.4, ry: h * 0.35,
        color: [30, 15, 40], // Dark purple
        driftX: -0.06, driftY: 0.04,
        phase: Math.PI * 0.7,
      },
      {
        x: w * 0.5, y: h * 0.8,
        rx: w * 0.45, ry: h * 0.3,
        color: [10, 30, 25], // Forest teal
        driftX: 0.04, driftY: -0.06,
        phase: Math.PI * 1.4,
      },
    ];

    // ─── RENDER LOOP ────────────────────────────────────────
    const render = (time) => {
      // Background base
      ctx.fillStyle = '#0D1315';
      ctx.fillRect(0, 0, w, h);

      // Draw nebula clouds
      for (const cloud of clouds) {
        const drift = Math.sin(time * 0.0001 + cloud.phase);
        const cx = cloud.x + drift * cloud.driftX * w * 0.3;
        const cy = cloud.y + Math.cos(time * 0.00008 + cloud.phase) * cloud.driftY * h * 0.3;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(cloud.rx, cloud.ry));
        const [r, g, b] = cloud.color;
        const pulse = 0.7 + Math.sin(time * 0.0003 + cloud.phase) * 0.3;

        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.25 * pulse})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.12 * pulse})`);
        grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${0.04 * pulse})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Draw star field
      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.alpha * (0.5 + twinkle * 0.5);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 220, ${alpha})`;
        ctx.fill();
      }

      // Subtle noise / dust grain overlay
      const noiseAlpha = 0.015 + Math.sin(time * 0.001) * 0.005;
      ctx.fillStyle = `rgba(156, 176, 128, ${noiseAlpha})`;
      for (let i = 0; i < 40; i++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        ctx.fillRect(nx, ny, 1, 1);
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}

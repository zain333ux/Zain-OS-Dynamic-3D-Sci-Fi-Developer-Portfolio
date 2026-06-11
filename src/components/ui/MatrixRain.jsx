import React, { useEffect, useRef, useState } from 'react';

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
const COLUMN_WIDTH = 18;
const FONT_SIZE = 14;
const MAX_DURATION = 12000; // 12 seconds

const MatrixRain = ({ onDismiss }) => {
  const canvasRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const animFrameRef = useRef(null);
  const dropsRef = useRef([]);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinitialize drops on resize
      const columns = Math.floor(canvas.width / COLUMN_WIDTH);
      dropsRef.current = Array.from({ length: columns }, () =>
        Math.random() * -50
      );
    };

    resize();
    window.addEventListener('resize', resize);

    // Fade in
    requestAnimationFrame(() => setOpacity(1));
    startTimeRef.current = Date.now();

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "Space Mono", monospace`;

      const drops = dropsRef.current;

      for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * COLUMN_WIDTH;
        const y = drops[i] * FONT_SIZE;

        // Bright green for the leading character, dimmer for trail
        if (Math.random() > 0.92) {
          ctx.fillStyle = '#FFFFFF'; // Occasional bright white flash
        } else {
          // Gradient from bright sage green to darker forest green
          const brightness = 0.5 + Math.random() * 0.5;
          const r = Math.floor(156 * brightness);
          const g = Math.floor(210 * brightness);
          const b = Math.floor(128 * brightness);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        }

        ctx.fillText(char, x, y);

        // Reset drop to top after passing the canvas + random offset
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 0.6 + Math.random() * 0.4;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    // Auto-dismiss after MAX_DURATION
    timeoutRef.current = setTimeout(() => {
      handleDismiss();
    }, MAX_DURATION);

    // Escape key listener
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleEsc);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDismiss = () => {
    setOpacity(0);
    // Wait for fade-out transition before unmounting
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] cursor-pointer"
      onClick={handleDismiss}
      style={{
        opacity,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: '#000000' }}
      />
      {/* Dismiss hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40 tracking-widest uppercase animate-pulse select-none pointer-events-none">
        Click anywhere or press ESC to exit
      </div>
    </div>
  );
};

export default MatrixRain;

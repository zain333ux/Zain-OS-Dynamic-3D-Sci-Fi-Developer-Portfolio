import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { playClick, playBootHum, stopBootHum } from '../../utils/audio';

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const crtLineRef = useRef(null);
  const consoleRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  
  const solvedStateRef = useRef({});

  // Custom text scrambling utility
  const scrambleText = (key, text, fraction) => {
    const chars = '$&%@#!=?*+-/\\<>[]{}|';
    const length = text.length;
    const solvedCount = Math.floor(length * fraction);
    
    // Play a typewriter click sound when new characters resolve
    if (solvedCount > (solvedStateRef.current[key] || 0)) {
      playClick();
      solvedStateRef.current[key] = solvedCount;
    }

    let result = '';
    
    for (let i = 0; i < length; i++) {
      if (i < solvedCount) {
        result += text[i];
      } else if (Math.random() < 0.4) {
        result += chars[Math.floor(Math.random() * chars.length)];
      } else {
        result += ' ';
      }
    }
    return result;
  };

  const [bootText1, setBootText1] = useState('');
  const [bootText2, setBootText2] = useState('');
  const [bootText3, setBootText3] = useState('');
  const [bootText4, setBootText4] = useState('');
  const [bootText5, setBootText5] = useState('');

  useEffect(() => {
    // Check if session has already booted to avoid showing preloader on refresh
    const hasBooted = sessionStorage.getItem('portfolio-booted');
    if (hasBooted === 'true') {
      onComplete();
      return;
    }

    if (!isPoweredOn) return;

    // Play deep sub bass hum when preloader screen powers on
    playBootHum();

    const tl = gsap.timeline({
      onComplete: () => {
        stopBootHum(); // stop the hum smoothly
        sessionStorage.setItem('portfolio-booted', 'true');
        onComplete();
      }
    });

    // 1. Initial CRT Line Boot-Up Flash (Horizontal)
    tl.set(containerRef.current, { visibility: 'visible' });
    tl.fromTo(crtLineRef.current, 
      { scaleX: 0, opacity: 0 }, 
      { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.inOut' }
    );

    // 2. Vertical flash expansion to reveal monitor screen
    tl.to(crtLineRef.current, {
      scaleY: 120, // Expands to cover full height
      opacity: 0.05,
      backgroundColor: '#9CB080',
      duration: 0.4,
      ease: 'power2.inOut',
    });

    // 3. Fade in terminal screen opacity
    tl.to(consoleRef.current, {
      opacity: 1,
      duration: 0.3
    }, '-=0.2');

    // 4. Sequence typing diagnostic text
    const text1 = '// CORES_SYSTEM BOOTUP INITIALIZED...';
    const text2 = 'FAST-NUCES ISLAMABAD // SECTOR [2025-2029]';
    const text3 = 'LATTICE_MESH_PHYSICS: COMPILED_STABLE';
    const text4 = 'DECRYPTING ENGINEER CONSOLE PORTFOLIO: zain_ul_abideen';
    const text5 = 'FOCUS_AREAS: [AI_SYSTEMS, COMPUTATIONAL_GRAPHS, GAME_ENGINES]';

    // Diagnostic typewriter sequence using manual state increments
    const textObj = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
    
    tl.to(textObj, {
      p1: 1,
      duration: 0.35,
      ease: 'none',
      onUpdate: () => setBootText1(scrambleText('p1', text1, textObj.p1))
    });

    tl.to(textObj, {
      p2: 1,
      duration: 0.35,
      ease: 'none',
      onUpdate: () => setBootText2(scrambleText('p2', text2, textObj.p2))
    }, '+=0.08');

    tl.to(textObj, {
      p3: 1,
      duration: 0.35,
      ease: 'none',
      onUpdate: () => setBootText3(scrambleText('p3', text3, textObj.p3))
    }, '+=0.08');

    tl.to(textObj, {
      p4: 1,
      duration: 0.4,
      ease: 'none',
      onUpdate: () => setBootText4(scrambleText('p4', text4, textObj.p4))
    }, '+=0.08');

    tl.to(textObj, {
      p5: 1,
      duration: 0.4,
      ease: 'none',
      onUpdate: () => setBootText5(scrambleText('p5', text5, textObj.p5))
    }, '+=0.08');

    // 5. Numerical loading percentage counter (0 to 100)
    const progressObj = { value: 0 };
    tl.to(progressObj, {
      value: 100,
      duration: 1.0,
      ease: 'power1.inOut',
      onUpdate: () => {
        setProgress(Math.floor(progressObj.value));
      }
    }, '+=0.2');

    // 6. Flash CRT screen white and shrink dispersion animation
    tl.to(consoleRef.current, {
      scale: 0.95,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.4,
      ease: 'power3.in'
    }, '+=0.2');

    tl.to(crtLineRef.current, {
      scaleY: 1,
      opacity: 1,
      backgroundColor: '#618764', // shift to green on close
      duration: 0.3,
      ease: 'power4.out'
    }, '-=0.2');

    tl.to(crtLineRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power4.inOut'
    });

    tl.to(containerRef.current, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.4
    });

  }, [onComplete, isPoweredOn]);

  // Standby click-to-initialize power screen (resolves browser autoplay policy blocks)
  if (!isPoweredOn) {
    const hasBooted = typeof window !== 'undefined' && sessionStorage.getItem('portfolio-booted') === 'true';
    if (hasBooted) return null;

    return (
      <div className="fixed inset-0 bg-bgDark z-[9999] flex flex-col items-center justify-center font-mono text-textMuted select-none pointer-events-auto p-4">
        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-50 opacity-60" />
        <div className="absolute inset-0 pointer-events-none z-50 border-[32px] border-black/85" />
        <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

        <div className="max-w-md w-full space-y-6 text-center border border-cardBorder p-8 rounded bg-cardBg backdrop-blur relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-accentCyan flex items-center justify-center animate-pulse shadow-glowCyan">
            <div className="w-4 h-4 bg-accentCyan rounded-full" />
          </div>
          <div className="space-y-2">
            <h1 className="text-textPrimary text-sm font-bold tracking-widest uppercase">// SYSTEM STANDBY</h1>
            <p className="text-[10px] text-textMuted/70 font-mono">zain@portfolio:~# ./initialize_terminal</p>
          </div>
          <button 
            onClick={() => {
              playClick();
              setIsPoweredOn(true);
            }}
            className="w-full py-2.5 px-4 border border-accentPurple rounded bg-accentPurple/10 hover:bg-accentPurple hover:text-textPrimary text-accentPurple font-bold tracking-widest text-[10px] transition-all duration-200 select-none shadow-glowPurple animate-pulse"
          >
            [ POWER ON CONSOLE ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-bgDark z-[9999] flex flex-col items-center justify-center select-none pointer-events-auto overflow-hidden"
      style={{ visibility: 'hidden' }}
    >
      {/* Scanline CRT monitor overlay filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-50 opacity-60" />
      
      {/* CRT Screen Tube Border Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 border-[32px] border-black/85" />
      <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

      {/* Center CRT Cathode Ray beam line */}
      <div 
        ref={crtLineRef} 
        className="absolute w-full h-[1.5px] bg-accentCyan opacity-0 shadow-glowCyan" 
      />

      {/* Terminal Readout Box */}
      <div 
        ref={consoleRef} 
        className="max-w-2xl px-8 w-full opacity-0 flex flex-col space-y-4 font-mono text-xs md:text-sm text-textMuted tracking-wider select-none relative z-10"
      >
        <div className="text-accentCyan font-bold">{bootText1}</div>
        <div className="text-textMuted/70">{bootText2}</div>
        <div className="text-accentPurple/80 font-medium">{bootText3}</div>
        <div className="text-textPrimary leading-relaxed">{bootText4}</div>
        <div className="text-accentCyan font-semibold text-[11px] md:text-xs leading-relaxed uppercase">{bootText5}</div>
        
        {/* Loading progress interface panel */}
        <div className="pt-8 space-y-3">
          <div className="flex justify-between items-center text-[10px] md:text-xs">
            <span>// BOOT_PROCESS: CONNECTING_MODULES</span>
            <span className="font-semibold text-accentCyan">{progress}%</span>
          </div>
          {/* Progress bar line */}
          <div className="w-full h-[2px] bg-cardBorder relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-accentPurple to-accentCyan shadow-glowPurple"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

import React, { useState, useEffect, useRef } from 'react';

const SECTIONS = [
  { id: '#home', name: 'CORE_ESTABLISHMENT (HERO)' },
  { id: '#about', name: 'INTELLIGENCE_METRIC (ABOUT)' },
  { id: '#education', name: 'ACADEMIC_DATABASE (EDUCATION)' },
  { id: '#stack', name: 'TECHNOLOGY_MATRIX (SKILLS)' },
  { id: '#projects', name: 'COMPILER_PIPELINE (PROJECTS)' },
  { id: '#learning', name: 'ONGOING_TRAINING (LEARNING)' },
  { id: '#volunteering', name: 'CIVIC_CONTRIBUTION (VOLUNTEER)' },
  { id: '#achievements', name: 'SYSTEM_CHECKPOINTS (ACHIEVEMENTS)' },
];

const DWELL_DURATION = 5000; // 5 seconds per section

const Autopilot = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DWELL_DURATION);
  
  const widgetRef = useRef(null);
  const timerRef = useRef(null);
  const tickRef = useRef(null);

  // Toggle autopilot
  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  // Autopilot loop and scrolling logic
  useEffect(() => {
    if (!isActive) {
      // Clean up timers when inactive
      if (timerRef.current) clearInterval(timerRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }

    // Scroll to the current target immediately when activated
    scrollToSection(currentIndex);
    setTimeLeft(DWELL_DURATION);

    // Dwell timer: trigger scroll to next section
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIdx = (prev + 1) % SECTIONS.length;
        scrollToSection(nextIdx);
        return nextIdx;
      });
      setTimeLeft(DWELL_DURATION);
    }, DWELL_DURATION);

    // Ticking timer: update progress bar every 100ms
    tickRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) return DWELL_DURATION;
        return prev - 100;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isActive, currentIndex]);

  // Handle auto-interruption by user actions
  useEffect(() => {
    if (!isActive) return;

    const handleUserInteraction = (e) => {
      // If action happens inside our widget panel, do not abort
      if (widgetRef.current && widgetRef.current.contains(e.target)) return;
      
      // Turn off autopilot instantly on manual scroll/input
      setIsActive(false);
    };

    // Listen to manual scroll, touch swipes, mouse clicks, and arrow keypresses
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });
    window.addEventListener('mousedown', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isActive]);

  const scrollToSection = (index) => {
    const targetId = SECTIONS[index].id;
    if (window.lenis) {
      // Smooth scroll using global Lenis instance
      window.lenis.scrollTo(targetId, {
        duration: 1.8,
        offset: -40,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
      });
    } else {
      // Native fallback
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Calculate terminal-style visual loading bar: [████░░░░░]
  const getProgressBarString = () => {
    const barLength = 10;
    const ratio = Math.max(0, Math.min(1, timeLeft / DWELL_DURATION));
    const activeChars = Math.round(ratio * barLength);
    return '█'.repeat(activeChars) + '░'.repeat(barLength - activeChars);
  };

  return (
    <div 
      ref={widgetRef}
      className="fixed bottom-6 left-6 z-40 font-mono text-[10px] select-none"
    >
      {isActive ? (
        // Active Telemetry Status Box
        <div className="glass-card bg-bgDark/85 border border-accentPurple/40 shadow-glowPurple p-4 w-[240px] space-y-3 rounded-sm">
          <div className="flex justify-between items-center border-b border-cardBorder pb-2">
            <span className="text-accentPurple font-bold flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-accentPurple rounded-full shadow-glowPurple animate-pulse" />
              Autopilot Active
            </span>
            <button 
              onClick={handleToggle}
              className="text-[9px] text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/80 px-2 py-0.5 bg-red-950/20 rounded-sm cursor-pointer"
            >
              ABORT
            </button>
          </div>
          
          <div className="space-y-1.5">
            <div className="text-[9px] text-textMuted uppercase">SHOWCASE DWELL REGION:</div>
            <div className="text-textPrimary truncate tracking-wider font-bold">
              {SECTIONS[currentIndex].name}
            </div>
            
            <div className="text-[9px] text-textMuted uppercase pt-1">TIMING QUEUE:</div>
            <div className="flex items-center justify-between text-accentCyan">
              <span>[{getProgressBarString()}]</span>
              <span className="font-bold">{(timeLeft / 1000).toFixed(1)}s</span>
            </div>
          </div>

          <div className="text-[8px] text-textMuted border-t border-cardBorder pt-2 italic text-center">
            // scroll mouse wheel to take control
          </div>
        </div>
      ) : (
        // Closed / Inactive Trigger Tab
        <button
          onClick={handleToggle}
          className="glass-card bg-bgDark/80 hover:bg-bgDark/95 border border-cardBorder hover:border-accentPurple/50 text-textMuted hover:text-textPrimary py-2 px-3 rounded-sm transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer"
          title="Start Cinematic Auto-scroll Tour"
        >
          <span className="w-1.5 h-1.5 bg-textMuted rounded-full" />
          <span className="tracking-widest font-bold font-mono">ENGAGE_AUTOPILOT.DAT</span>
        </button>
      )}
    </div>
  );
};

export default Autopilot;

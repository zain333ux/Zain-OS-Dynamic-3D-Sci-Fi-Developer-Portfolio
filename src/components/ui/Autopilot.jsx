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

const getSectionDwell = (sectionId) => {
  if (sectionId === '#education') return 9000; // 3 academic milestones * 3s each
  if (sectionId === '#projects') return 12000; // 4 active projects * 3s each
  return 5000; // 5s standard dwell duration
};

const Autopilot = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5000);
  const [currentDwell, setCurrentDwell] = useState(5000);
  
  const widgetRef = useRef(null);
  const tickRef = useRef(null);

  // Sync body class & trigger custom state events when Autopilot state changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('autopilot-state', { detail: isActive }));
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('autopilot-active', isActive);
    }
  }, [isActive]);

  // Toggle autopilot
  const handleToggle = () => {
    setIsActive((prev) => {
      const nextActive = !prev;
      if (nextActive) {
        setCurrentIndex(0);
      }
      return nextActive;
    });
  };

  // Scroll and dwell setup on active index change
  useEffect(() => {
    if (!isActive) return;

    // Scroll to the current target section
    scrollToSection(currentIndex);
    
    // Get and apply the dynamic dwell duration for the section
    const targetId = SECTIONS[currentIndex].id;
    const dwell = getSectionDwell(targetId);
    setCurrentDwell(dwell);
    setTimeLeft(dwell);

  }, [isActive, currentIndex]);

  // Unified tick loop
  useEffect(() => {
    if (!isActive) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }

    tickRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const nextVal = prev - 100;
        if (nextVal <= 0) {
          // Time is up! Move to the next section
          setCurrentIndex((prevIdx) => (prevIdx + 1) % SECTIONS.length);
          return 0;
        }
        return nextVal;
      });
    }, 100);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isActive]);

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
    const element = document.querySelector(targetId);
    if (!element) return;

    let scrollTarget = element;
    let customOffset = -40; // Default header offset

    if (window.lenis) {
      // Find the carousel container (the "fixed frame") and center it vertically
      if (targetId === '#projects' || targetId === '#education' || targetId === '#stack') {
        const carousel = element.querySelector('.cursor-grab');
        if (carousel) {
          scrollTarget = carousel;
          // Calculate offset to center the container center with viewport center
          customOffset = -window.innerHeight / 2 + carousel.offsetHeight / 2;
        }
      }

      window.lenis.scrollTo(scrollTarget, {
        duration: 1.0,
        offset: customOffset,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
      });
    } else {
      // Native fallback
      if (targetId === '#projects' || targetId === '#education' || targetId === '#stack') {
        const carousel = element.querySelector('.cursor-grab');
        if (carousel) {
          carousel.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate terminal-style visual loading bar: [████░░░░░]
  const getProgressBarString = () => {
    const barLength = 10;
    const ratio = Math.max(0, Math.min(1, timeLeft / currentDwell));
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
          className="glass-card bg-bgDark/80 hover:bg-bgDark/95 border border-cardBorder hover:border-accentPurple/50 text-textMuted hover:text-textPrimary py-1.5 px-2.5 md:py-2 md:px-3 rounded-sm transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-sm cursor-pointer touch-target"
          title="Start Cinematic Auto-scroll Tour"
        >
          <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-textMuted rounded-full" />
          <span className="tracking-widest font-bold font-mono text-[8px] md:text-[10px]">
            <span className="inline md:hidden">AUTO_TOUR</span>
            <span className="hidden md:inline">ENGAGE_AUTOPILOT.DAT</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default Autopilot;

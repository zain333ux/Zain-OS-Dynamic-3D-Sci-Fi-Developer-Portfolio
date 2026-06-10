import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import CodeBackdrop from '../components/ui/CodeBackdrop';

const InteractiveDeck = () => {
  const [isDesktopDeck, setIsDesktopDeck] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [systemLogs, setSystemLogs] = useState([
    'Initializing deck system...',
    'Compiling graphic modules...',
    'WebGL rendering cores active.',
  ]);

  const triggerRef = useRef(null);
  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);
  const slide3Ref = useRef(null);

  // Time stamp for telemetry display
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toISOString().replace('T', ' ').substring(0, 19));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check screen dimensions for responsive fallback
  useEffect(() => {
    const handleResize = () => {
      setIsDesktopDeck(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Append logs dynamically based on active slide for console experience
  useEffect(() => {
    const messages = [
      ['[MODULE]: Loading academic credentials...', '> Matric: FBISE 987/1100', '> Intermediate: FBISE 1017/1100', '> BS CS: FAST-NUCES (GPA: 3.02)'],
      ['[MODULE]: Syncing technology matrix...', '> Core languages active: C++, Python, JS', '> Graphics engine: SFML compile OK', '> System architectures online'],
      ['[MODULE]: Fetching project builds...', '> Economic Dynamics: Cosine graphs generated', '> 2D Metal Slug Engine: State factory active', '> Optimizers: SGD loops converged'],
    ];
    
    const indexMsgs = messages[activeIndex] || [];
    setSystemLogs((prev) => {
      const nextLogs = [...prev, ...indexMsgs];
      if (nextLogs.length > 8) {
        return nextLogs.slice(nextLogs.length - 8); // Keep last 8 lines
      }
      return nextLogs;
    });
  }, [activeIndex]);

  // GSAP 3D Deck animation timeline definition
  useEffect(() => {
    if (!isDesktopDeck) return;

    gsap.registerPlugin(ScrollTrigger);

    const slide1 = slide1Ref.current;
    const slide2 = slide2Ref.current;
    const slide3 = slide3Ref.current;
    const trigger = triggerRef.current;

    // Set initial stacking offsets in 3D perspective space
    gsap.set(slide2, {
      opacity: 0,
      z: -120,
      rotateX: 12,
      yPercent: 15,
      scale: 0.95,
      pointerEvents: 'none',
    });
    gsap.set(slide3, {
      opacity: 0,
      z: -240,
      rotateX: 24,
      yPercent: 30,
      scale: 0.9,
      pointerEvents: 'none',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrub tracking
        onUpdate: (self) => {
          const progress = self.progress;
          let idx = 0;
          if (progress >= 0.35 && progress < 0.7) {
            idx = 1;
          } else if (progress >= 0.7) {
            idx = 2;
          }
          setActiveIndex(idx);
        },
      },
    });

    // Step 1: Slide 1 (Education) recedes/flips away, Slide 2 (Skills) becomes active front
    tl.to(slide1, {
      opacity: 0,
      yPercent: -130,
      z: -300,
      rotateX: -25,
      rotateY: -5,
      scale: 0.82,
      pointerEvents: 'none',
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    tl.to(slide2, {
      opacity: 1,
      z: 0,
      rotateX: 0,
      yPercent: 0,
      scale: 1,
      pointerEvents: 'auto',
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    tl.to(slide3, {
      opacity: 0.35,
      z: -120,
      rotateX: 12,
      yPercent: 15,
      scale: 0.95,
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    // Step 2: Slide 2 (Skills) recedes/flips away, Slide 3 (Projects) becomes active front
    tl.to(slide2, {
      opacity: 0,
      yPercent: -130,
      z: -300,
      rotateX: -25,
      rotateY: -5,
      scale: 0.82,
      pointerEvents: 'none',
      duration: 1,
      ease: 'power2.inOut',
    }, 1);

    tl.to(slide3, {
      opacity: 1,
      z: 0,
      rotateX: 0,
      yPercent: 0,
      scale: 1,
      pointerEvents: 'auto',
      duration: 1,
      ease: 'power2.inOut',
    }, 1);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [isDesktopDeck]);

  const handleNavClick = (anchorId) => {
    const target = document.getElementById(anchorId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fallback sequential rendering for mobile/tablet screens
  if (!isDesktopDeck) {
    return (
      <div className="relative">
        <Education isDeckView={false} />
        <Skills isDeckView={false} />
        <Projects isDeckView={false} />
      </div>
    );
  }

  return (
    <div ref={triggerRef} className="relative h-[300vh] w-full">
      {/* Scroll targets positioned mathematically to intercept Lenis scroll anchors */}
      <div id="education-deck" className="absolute top-0 h-10 w-10 pointer-events-none" />
      <div id="stack" className="absolute top-[100vh] h-10 w-10 pointer-events-none" />
      <div id="projects" className="absolute top-[200vh] h-10 w-10 pointer-events-none" />

      {/* Pinned console environment viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-bgDark border-b border-cardBorder">
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(156,176,128,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(156,176,128,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        {/* Ambient scanner beam overlay */}
        <div className="absolute w-full h-[2px] bg-accentPurple/5 top-0 left-0 animate-pulse pointer-events-none" />

        <div className="max-w-7xl w-full h-full flex flex-row items-center px-6 lg:px-8 gap-8 relative z-10 py-16">
          
          {/* Side Command / Telemetry Bar Panel */}
          <div className="w-[280px] h-[80vh] flex flex-col justify-between border border-cardBorder bg-cardBg/45 backdrop-blur-md p-6 font-mono shrink-0 select-none">
            <div className="space-y-6">
              {/* Header telemetry details */}
              <div className="border-b border-cardBorder pb-4">
                <div className="text-[10px] text-accentPurple font-bold">// SYSTEM COMMAND DECK</div>
                <div className="text-[9px] text-textMuted mt-1">STATUS: OPERATIONAL</div>
                <div className="text-[9px] text-textMuted">RENDER: GL_PERSPECTIVE_3D</div>
              </div>

              {/* Deck links menu */}
              <div className="space-y-3 pt-2">
                {[
                  { id: 'education-deck', label: '01. EDUCATION', index: 0 },
                  { id: 'stack', label: '02. STACK MATRIX', index: 1 },
                  { id: 'projects', label: '03. BINARY DEPLOY', index: 2 },
                ].map((item) => {
                  const isActive = activeIndex === item.index;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left text-xs py-2 px-3 border transition-all duration-300 relative group flex items-center justify-between
                        ${isActive 
                          ? 'border-accentPurple/50 bg-accentPurple/10 text-textPrimary shadow-glowPurple' 
                          : 'border-transparent text-textMuted hover:text-textPrimary hover:border-cardBorder hover:bg-white/2'
                        }`}
                    >
                      <span className="tracking-widest font-bold">{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-accentPurple rounded-full shadow-glowPurple animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom logs console screen */}
            <div className="space-y-4 pt-4 border-t border-cardBorder">
              <div>
                <div className="text-[9px] text-textMuted mb-2 uppercase">// REMOTE SHELL LOGS</div>
                <div className="bg-bgDark/80 p-2.5 rounded border border-cardBorder/50 h-[180px] overflow-hidden flex flex-col justify-end gap-1.5">
                  {systemLogs.map((log, idx) => (
                    <div key={idx} className="text-[8px] leading-tight text-accentCyan/80 tracking-wider truncate">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Time stamp */}
              <div className="flex justify-between items-center text-[8px] text-textMuted">
                <span>{timestamp}</span>
                <span>ZAIN_OS v1.0.3</span>
              </div>
            </div>
          </div>

          {/* Main 3D Slides Deck Viewport Container */}
          <div className="flex-1 h-[80vh] relative flex items-center justify-center" style={{ perspective: '1200px' }}>
            
            {/* Slide 1: Education Window */}
            <div
              ref={slide1Ref}
              className="absolute w-full h-full border border-cardBorder bg-bgDark/90 shadow-2xl overflow-hidden rounded flex flex-col"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                zIndex: activeIndex === 0 ? 30 : 10,
              }}
            >
              {/* Terminal Window Header */}
              <div className="h-8 border-b border-cardBorder bg-cardBg flex items-center justify-between px-4 select-none shrink-0 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-accentCyan/30 border border-accentCyan/50" />
                    <span className="w-2 h-2 rounded-full bg-accentPurple/30 border border-accentPurple/50" />
                    <span className="w-2 h-2 rounded-full bg-textMuted/30 border border-cardBorder" />
                  </div>
                  <span className="text-textMuted font-bold">// SYSTEM_ACADEMIC_ROADMAP.DAT</span>
                </div>
                <span className="text-accentPurple font-bold">ACCESS: SECURE</span>
              </div>

              {/* Slide content area */}
              <div className="flex-1 p-6 md:p-8 overflow-hidden relative">
                <CodeBackdrop type="education" />
                <div className="relative z-10 w-full h-full flex flex-col">
                  <div className="mb-4 shrink-0">
                    <h3 className="font-heading text-xl font-bold text-textPrimary tracking-wide">// Academic Records</h3>
                    <p className="text-[9px] text-textMuted font-mono uppercase mt-0.5">// ACADEMIC TIMELINE &amp; METHODOLOGY</p>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <Education isDeckView={true} />
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Skills Window */}
            <div
              ref={slide2Ref}
              className="absolute w-full h-full border border-cardBorder bg-bgDark/90 shadow-2xl overflow-hidden rounded flex flex-col"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                zIndex: activeIndex === 1 ? 30 : 10,
              }}
            >
              {/* Terminal Window Header */}
              <div className="h-8 border-b border-cardBorder bg-cardBg flex items-center justify-between px-4 select-none shrink-0 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-accentCyan/30 border border-accentCyan/50" />
                    <span className="w-2 h-2 rounded-full bg-accentPurple/30 border border-accentPurple/50" />
                    <span className="w-2 h-2 rounded-full bg-textMuted/30 border border-cardBorder" />
                  </div>
                  <span className="text-textMuted font-bold">// TECH_SKILLS_MATRIX.SYS</span>
                </div>
                <span className="text-accentPurple font-bold">MODE: SECURE</span>
              </div>

              {/* Slide content area */}
              <div className="flex-1 p-6 md:p-8 overflow-hidden relative">
                <CodeBackdrop type="skills" />
                <div className="relative z-10 w-full h-full flex flex-col">
                  <div className="mb-4 shrink-0">
                    <h3 className="font-heading text-xl font-bold text-textPrimary tracking-wide">// Skills &amp; Technology Matrix</h3>
                    <p className="text-[9px] text-textMuted font-mono uppercase mt-0.5">// CURRENT DEVELOPMENT VECTORS &amp; PROFICIENCIES</p>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <Skills isDeckView={true} />
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3: Projects Window */}
            <div
              ref={slide3Ref}
              className="absolute w-full h-full border border-cardBorder bg-bgDark/90 shadow-2xl overflow-hidden rounded flex flex-col"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                zIndex: activeIndex === 2 ? 30 : 10,
              }}
            >
              {/* Terminal Window Header */}
              <div className="h-8 border-b border-cardBorder bg-cardBg flex items-center justify-between px-4 select-none shrink-0 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-accentCyan/30 border border-accentCyan/50" />
                    <span className="w-2 h-2 rounded-full bg-accentPurple/30 border border-accentPurple/50" />
                    <span className="w-2 h-2 rounded-full bg-textMuted/30 border border-cardBorder" />
                  </div>
                  <span className="text-textMuted font-bold">// PROJECT_BINARY_EXECUTABLES.EXE</span>
                </div>
                <span className="text-accentPurple font-bold">STATE: COMPILED</span>
              </div>

              {/* Slide content area */}
              <div className="flex-1 p-6 md:p-8 overflow-hidden relative">
                <CodeBackdrop type="projects" />
                <div className="relative z-10 w-full h-full flex flex-col">
                  <div className="mb-4 shrink-0">
                    <h3 className="font-heading text-xl font-bold text-textPrimary tracking-wide">// Compiled Projects</h3>
                    <p className="text-[9px] text-textMuted font-mono uppercase mt-0.5">// DYNAMIC COMPILER PIPELINE</p>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <Projects isDeckView={true} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default InteractiveDeck;

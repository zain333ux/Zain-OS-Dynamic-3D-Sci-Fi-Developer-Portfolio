import React, { useRef, useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { skills } from '../data/skills';
import { gsap } from 'gsap';

const Skills = () => {
  const parallaxRef = useRef(null);
  const parallaxRingRef = useRef(null);
  const ringDialRef = useRef(null);
  const ringDialInnerRef = useRef(null);

  useEffect(() => {
    const el = parallaxRef.current;
    if (el) {
      gsap.fromTo(el,
        { y: -60, rotation: 0 },
        {
          y: 80,
          rotation: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '#stack',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    const ringEl = parallaxRingRef.current;
    if (ringEl) {
      gsap.fromTo(ringEl,
        { y: 80 },
        {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: '#stack',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    const ringDial = ringDialRef.current;
    if (ringDial) {
      gsap.fromTo(ringDial,
        { strokeDashoffset: 283 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#stack',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }

    const ringDialInner = ringDialInnerRef.current;
    if (ringDialInner) {
      gsap.fromTo(ringDialInner,
        { strokeDashoffset: 0 },
        {
          strokeDashoffset: 238,
          ease: 'none',
          scrollTrigger: {
            trigger: '#stack',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }
  }, []);
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isInteractingRef = useRef(false);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const halfWidth = container.scrollWidth / 2;
    const maxScroll = halfWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const currentScroll = container.scrollLeft % halfWidth;
    setScrollProgress(Math.min(1, currentScroll / maxScroll));
  };

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount = 380; // Scroll distance per click
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Marquee auto-scroll loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId;
    const scrollSpeed = 0.5; // pixels per frame

    const tick = () => {
      // Pause marquee if dragging, hovered, touched, or auto-play is toggled off
      if (isAutoPlayActive && !isHovered && !isDown && !isInteractingRef.current) {
        container.scrollLeft += scrollSpeed;
        
        // Loop boundary check (when scrolled past the unique content length)
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += halfWidth;
        }
      }
      handleScroll();
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isAutoPlayActive, isHovered, isDown]);

  const skillsGroups = [
    {
      title: "// Core Programming",
      items: skills.coreProgramming
    },
    {
      title: "// Data & Mathematics",
      items: skills.dataAndMath
    },
    {
      title: "// AI & Automation Direction",
      items: skills.aiAndAutomation
    },
    {
      title: "// Tools I Use",
      items: skills.toolsIUse
    }
  ];

  const marqueeGroups = [...skillsGroups, ...skillsGroups];

  return (
    <section id="stack" className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="skills" />
      
      {/* Parallax Background HUD Element 1 */}
      <div 
        ref={parallaxRef} 
        className="absolute w-[240px] h-[360px] border border-dashed border-cardBorder/35 top-[20%] left-[-60px] opacity-[0.035] pointer-events-none select-none z-0 hidden md:block"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-cardBorder/25" />
        <div className="absolute top-0 bottom-0 left-24 w-[1px] bg-cardBorder/25 border-dashed" />
        <div className="absolute top-0 bottom-0 left-36 w-[1px] bg-cardBorder/25" />
        <div className="absolute top-12 left-0 right-0 h-[1px] bg-cardBorder/25" />
        <div className="absolute top-24 left-0 right-0 h-[1px] bg-cardBorder/25 border-dashed" />
        <div className="absolute top-36 left-0 right-0 h-[1px] bg-cardBorder/25" />
        <div className="p-4 font-mono text-[8px] text-textMuted tracking-widest space-y-2 uppercase">
          <div>LOC: 0x2A7B</div>
          <div>CORE_SYS: RUNNING</div>
          <div>SEC: STABLE</div>
        </div>
      </div>

      {/* Parallax Background HUD Element 2: Rotating Cyber Ring */}
      <div 
        ref={parallaxRingRef} 
        className="absolute w-[350px] h-[350px] bottom-[10%] right-[-120px] opacity-[0.06] pointer-events-none select-none z-0 hidden md:block"
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="url(#skills-dial-gradient)" 
            strokeWidth="0.8" 
            strokeDasharray="283" 
            ref={ringDialRef}
            className="transform origin-center animate-[spin_40s_linear_infinite]"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="38" 
            stroke="#273338" 
            strokeWidth="0.5" 
            strokeDasharray="238" 
            ref={ringDialInnerRef}
            className="transform origin-center animate-[spin_20s_linear_infinite_reverse]"
          />
          <defs>
            <linearGradient id="skills-dial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9CB080" />
              <stop offset="100%" stopColor="#618764" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start lg:items-end gap-4 border-b border-cardBorder pb-4">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Skills &amp; Technology Matrix</h2>
            <p className="text-xs text-textMuted font-mono mt-1 uppercase">// CURRENT DEVELOPMENT VECTORS &amp; PROFICIENCIES</p>
          </Reveal>

          {/* Slider Buttons / Telemetry Pause Toggle */}
          <Reveal delay={0.05}>
            <div className="flex items-center gap-1.5 md:gap-2 font-mono text-[8px] md:text-[10px]">
              <button
                onClick={() => setIsAutoPlayActive(!isAutoPlayActive)}
                className={`flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 border border-cardBorder bg-cardBg hover:border-accentPurple/50 text-textMuted hover:text-textPrimary transition-all duration-200 rounded-sm select-none cursor-pointer touch-target`}
                title={isAutoPlayActive ? "Click to Pause Marquee" : "Click to Resume Marquee"}
              >
                <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isAutoPlayActive ? 'bg-accentPurple shadow-glowPurple animate-pulse' : 'bg-red-500'}`} />
                <span>{isAutoPlayActive ? "AUTO: ACTIVE" : "AUTO: PAUSED"}</span>
              </button>

              <button
                onClick={() => scroll('left')}
                className="px-2 py-1 md:px-3 md:py-1.5 border border-cardBorder bg-cardBg hover:bg-accentPurple/10 hover:border-accentPurple/50 text-textMuted hover:text-textPrimary transition-all duration-200 rounded-sm select-none cursor-pointer touch-target"
              >
                &lt;&lt; PREV
              </button>
              <button
                onClick={() => scroll('right')}
                className="px-2 py-1 md:px-3 md:py-1.5 border border-cardBorder bg-cardBg hover:bg-accentPurple/10 hover:border-accentPurple/50 text-textMuted hover:text-textPrimary transition-all duration-200 rounded-sm select-none cursor-pointer touch-target"
              >
                NEXT &gt;&gt;
              </button>
            </div>
          </Reveal>
        </div>

        {/* Horizontal scrollable track */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onTouchStart={() => { isInteractingRef.current = true; }}
          onTouchEnd={() => { isInteractingRef.current = false; }}
          className={`flex flex-row gap-6 overflow-x-auto scrollbar-none py-4 cursor-grab active:cursor-grabbing relative z-10 select-none ${(isHovered || isDown || !isAutoPlayActive) ? 'snap-x snap-mandatory' : ''}`}
        >
          {marqueeGroups.map((card, index) => (
            <div 
              key={index} 
              className="snap-start flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[400px]"
            >
              <Card className="flex flex-col justify-between h-full space-y-4">
                <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">{card.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {card.items.map((skill, idx) => (
                    <Badge key={idx} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Console-style Progress Tracker */}
        <div className="flex items-center justify-between font-mono text-[9px] text-textMuted pt-4 max-w-sm mx-auto">
          <span>[SYSTEM: STACK_L]</span>
          <div className="w-48 h-[2px] bg-cardBorder relative overflow-hidden rounded-full mx-4">
            <div
              className="absolute top-0 bottom-0 left-0 bg-accentPurple transition-transform duration-100 origin-left"
              style={{ transform: `scaleX(${scrollProgress})`, width: '100%' }}
            />
          </div>
          <span>[SYSTEM: STACK_R]</span>
        </div>

      </div>
    </section>
  );
};

export default Skills;


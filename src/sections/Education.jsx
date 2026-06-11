import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { educationList } from '../data/education';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playMutedRelayTick } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

const Education = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Auto-play state
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Drag states
  const [dragStartY, setDragStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Responsive tracking
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Viewport detection via GSAP ScrollTrigger to bypass browser 3D perspective bugs
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 85%',
      end: 'bottom 15%',
      onToggle: (self) => {
        setIsIntersecting(self.isActive);
        if (self.isActive) {
          // Reset to first card when section enters viewport
          setActiveIndex(0);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Reset scroll container position when filter changes (not needed for education, but tracks window resize)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Vertical autoplay loop
  useEffect(() => {
    if (!isAutoPlayActive || isHovered || !isIntersecting || educationList.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % educationList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoPlayActive, isHovered, isIntersecting]);

  const handlePrev = () => {
    if (educationList.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + educationList.length) % educationList.length);
  };

  const handleNext = () => {
    if (educationList.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % educationList.length);
  };

  // Vertical Drag handlers for discrete swipe tracking
  const handleMouseDown = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    playMutedRelayTick();
    setDragStartY(e.pageY);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragStartY === null) return;
    
    const currentY = e.pageY;
    const diffY = currentY - dragStartY;
    const threshold = 60; // Pixel threshold to rotate card vertically

    if (diffY > threshold) {
      handlePrev(); // Swipe down -> scrolls down (show previous)
      setDragStartY(currentY); // reset base so drag can continue
    } else if (diffY < -threshold) {
      handleNext(); // Swipe up -> scrolls up (show next)
      setDragStartY(currentY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartY(null);
  };

  // Vertical radius based on responsive screen width
  const getVerticalRadius = () => {
    if (windowWidth >= 768) return 150;
    return 100; // Compact vertical radius for mobile screens
  };

  return (
    <section 
      ref={sectionRef}
      id="education" 
      className="section-pad relative overflow-hidden border-t border-cardBorder"
    >
      <CodeBackdrop type="education" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex justify-between items-end gap-4 border-b border-cardBorder pb-4">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Education</h2>
            <p className="text-xs text-textMuted font-mono mt-1 uppercase">// ACADEMIC TIMELINE ROADMAP</p>
          </Reveal>

          {/* Slider Controls */}
          <Reveal delay={0.05}>
            <div className="flex items-center gap-3 font-mono text-[10px]">
              {/* Play/Pause Toggle Indicator */}
              <button
                onClick={() => setIsAutoPlayActive(!isAutoPlayActive)}
                className={`flex items-center gap-2 px-3 py-1.5 border border-cardBorder bg-cardBg hover:border-accentPurple/50 text-textMuted hover:text-textPrimary transition-all duration-200 rounded-sm select-none cursor-pointer`}
                title={isAutoPlayActive ? "Click to Pause Auto-rotation" : "Click to Play Auto-rotation"}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAutoPlayActive ? 'bg-accentPurple shadow-glowPurple animate-pulse' : 'bg-red-500'}`} />
                <span>{isAutoPlayActive ? "AUTO: PLAYING" : "AUTO: PAUSED"}</span>
              </button>

              <button
                onClick={handlePrev}
                disabled={educationList.length <= 1}
                className="px-3 py-1.5 border border-cardBorder bg-cardBg hover:bg-accentPurple/10 hover:border-accentPurple/50 text-textMuted hover:text-textPrimary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 rounded-sm select-none cursor-pointer"
              >
                /\ UP
              </button>
              <button
                onClick={handleNext}
                disabled={educationList.length <= 1}
                className="px-3 py-1.5 border border-cardBorder bg-cardBg hover:bg-accentPurple/10 hover:border-accentPurple/50 text-textMuted hover:text-textPrimary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 rounded-sm select-none cursor-pointer"
              >
                \/ DOWN
              </button>
            </div>
          </Reveal>
        </div>

        {/* 3D Vertical Rotating Carousel Container */}
        <div 
          className="relative w-full h-[480px] md:h-[540px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); handleMouseUp(); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ perspective: '1200px' }}
        >
          {educationList.map((item, idx) => {
            const totalCards = educationList.length;
            let transformStyle = {};

            if (totalCards === 1) {
              transformStyle = {
                transform: 'translate3d(0px, 0px, 0px) rotateX(0deg) scale(1)',
                zIndex: 10,
                opacity: 1,
                pointerEvents: 'auto'
              };
            } else {
              // Shortest distance wrapping
              let diff = idx - activeIndex;
              if (diff < -totalCards / 2) diff += totalCards;
              if (diff > totalCards / 2) diff -= totalCards;

              const angle = (diff * 2 * Math.PI) / totalCards;
              const radius = getVerticalRadius();

              const ty = Math.sin(angle) * radius;
              const tz = (Math.cos(angle) - 1) * radius;
              // Tilt cards dynamically on X-axis as they rotate up/down
              const rx = -angle * (180 / Math.PI) * 0.45;
              const scale = idx === activeIndex ? 1 : 0.85;
              const opacity = idx === activeIndex ? 1 : 0;
              const zIndex = idx === activeIndex ? 100 : 10;
              const pointerEvents = idx === activeIndex ? 'auto' : 'none';

              transformStyle = {
                transform: `translate3d(0, ${ty}px, ${tz}px) rotateX(${rx}deg) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
                pointerEvents: pointerEvents
              };
            }

            return (
              <div 
                key={item.id} 
                className="absolute w-[88vw] sm:w-[460px] md:w-[480px] lg:w-[500px] h-[320px] md:h-[350px] transition-all duration-700 ease-out"
                style={{
                  ...transformStyle,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                <Card className="space-y-4 hover:border-accentPurple/40 transition-colors h-full flex flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-textPrimary leading-snug">{item.institution}</h3>
                        <p className="text-xs font-mono text-accentCyan mt-1">{item.degree}</p>
                      </div>
                      <span className="font-mono text-xs text-textMuted py-1 px-2.5 bg-cardBg border border-cardBorder rounded select-none shrink-0">
                        {item.timeline}
                      </span>
                    </div>

                    <div className="space-y-3 mt-3">
                      <div className="text-xs font-mono text-textMuted leading-relaxed border-l-2 border-accentCyan/30 pl-3">
                        {item.details}
                      </div>

                      {item.courses && item.courses.length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-1.5 max-h-[48px] overflow-hidden">
                            {item.courses.map((course, idx) => (
                              <Badge key={idx} name={course} className="text-[9px] py-0.5" />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-cardBorder pt-3">
                    <h4 className="text-[9px] font-mono text-textPrimary uppercase tracking-widest mb-1">// Focus &amp; Approach</h4>
                    <p className="text-xs text-textMuted leading-normal line-clamp-2">
                      {item.approach}
                    </p>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Slide Indicator Dots */}
        {educationList.length > 1 && (
          <div className="flex justify-center items-center gap-2 pt-2">
            {educationList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex ? 'bg-accentPurple w-4 shadow-glowPurple' : 'bg-cardBorder hover:bg-textMuted'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Education;

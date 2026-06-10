import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import ProjectCardVisualizer from '../components/ui/ProjectCardVisualizer';
import { projects } from '../data/projects';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const filters = [
  "All",
  "Data & Optimization",
  "Game Development",
  "Academic CS Projects",
  "Software Development"
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Auto-play state
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Drag states
  const [dragStartX, setDragStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Responsive radius tracking
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
          // Reset to first project when section enters viewport
          setActiveIndex(0);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Filter projects by checking the categories array
  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(project => project.categories.includes(activeFilter));

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  // Track window size for radius adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay loop timer
  useEffect(() => {
    if (!isAutoPlayActive || isHovered || !isIntersecting || filteredProjects.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoPlayActive, isHovered, isIntersecting, filteredProjects.length]);

  const handlePrev = () => {
    if (filteredProjects.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  const handleNext = () => {
    if (filteredProjects.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  // Drag handlers for discrete swipe tracking
  const handleMouseDown = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    setDragStartX(e.pageX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragStartX === null) return;
    
    const currentX = e.pageX;
    const diffX = currentX - dragStartX;
    const threshold = 70; // Pixel threshold to rotate card

    if (diffX > threshold) {
      handlePrev();
      setDragStartX(currentX); // reset base so drag can continue
    } else if (diffX < -threshold) {
      handleNext();
      setDragStartX(currentX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartX(null);
  };

  const renderLinkButton = (key, link) => {
    const isComingSoon = link.type === 'coming-soon';
    
    const labels = {
      github: { active: "View GitHub ↗", placeholder: "GitHub Coming Soon" },
      report: { active: "Open Report ↗", placeholder: "Report Coming Soon" },
      notebook: { active: "Open Notebook ↗", placeholder: "Notebook Coming Soon" },
      demo: { active: "View Demo ↗", placeholder: "Demo Coming Soon" }
    };

    const displayLabel = isComingSoon 
      ? labels[key]?.placeholder || "Coming Soon" 
      : labels[key]?.active || "Open Asset ↗";

    if (isComingSoon) {
      return (
        <Button 
          key={key} 
          variant="placeholder" 
          title="This resource is being finalized and will be uploaded soon."
          className="text-[9px] py-1.5 px-3"
        >
          {displayLabel}
        </Button>
      );
    }

    return (
      <Button 
        key={key} 
        variant="secondary" 
        isExternal
        href={link.url}
        onClick={(e) => e.stopPropagation()} // Prevent card overlay click
        className="text-[9px] py-1.5 px-3 select-none"
      >
        {displayLabel.replace(" ↗", "")}
      </Button>
    );
  };

  // Calculate radius based on responsive screen width
  const getRadius = () => {
    if (windowWidth >= 1200) return 380;
    if (windowWidth >= 768) return 280;
    return 140; // Compact radius for mobile screens
  };

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="section-pad relative overflow-hidden border-t border-cardBorder"
    >
      <CodeBackdrop type="projects" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-cardBorder pb-4">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Projects</h2>
            <p className="text-xs text-textMuted font-mono mt-1 uppercase">// DYNAMIC COMPILER PIPELINE</p>
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
                disabled={filteredProjects.length <= 1}
                className="px-3 py-1.5 border border-cardBorder bg-cardBg hover:bg-accentPurple/10 hover:border-accentPurple/50 text-textMuted hover:text-textPrimary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 rounded-sm select-none cursor-pointer"
              >
                &lt;&lt; PREV
              </button>
              <button
                onClick={handleNext}
                disabled={filteredProjects.length <= 1}
                className="px-3 py-1.5 border border-cardBorder bg-cardBg hover:bg-accentPurple/10 hover:border-accentPurple/50 text-textMuted hover:text-textPrimary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 rounded-sm select-none cursor-pointer"
              >
                NEXT &gt;&gt;
              </button>
            </div>
          </Reveal>
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-cardBg border border-cardBorder p-1 rounded max-w-full w-max">
          {filters.map((f, idx) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={idx}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider transition-all duration-200 rounded-sm cursor-pointer select-none
                  ${isActive 
                    ? "bg-accentPurple/20 text-textPrimary border border-accentPurple/50 shadow-glowPurple" 
                    : "text-textMuted hover:text-textPrimary border border-transparent"
                  }`}
              >
                {f === "Academic CS Projects" ? "Academic CS" : f === "Software Development" ? "Software Dev" : f}
              </button>
            );
          })}
        </div>

        {/* 3D Rotating Carousel Container */}
        <div 
          className="relative w-full h-[520px] md:h-[580px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); handleMouseUp(); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ perspective: '1200px' }}
        >
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-cardBorder rounded-md w-full">
              <p className="font-mono text-sm text-textMuted">// NO COMPATIBLE MODULES FOUND FOR SELECTED FILTER</p>
            </div>
          ) : (
            filteredProjects.map((project, idx) => {
              const totalCards = filteredProjects.length;
              
              // Trigonometric calculations for 3D positioning
              let transformStyle = {};
              
              if (totalCards === 1) {
                transformStyle = {
                  transform: 'translate3d(0px, 0px, 0px) rotateY(0deg) scale(1)',
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
                const radius = getRadius();
                
                const tx = Math.sin(angle) * radius;
                const tz = (Math.cos(angle) - 1) * radius;
                // Gently tilt Y angle facing inward
                const ry = angle * (180 / Math.PI) * 0.45;
                const scale = 0.8 + 0.2 * Math.cos(angle);
                const opacity = 0.18 + 0.82 * (Math.cos(angle) + 1) / 2;
                const zIndex = Math.round((Math.cos(angle) + 1) * 100);
                
                // Only allow click interactions on the front-most card to preserve clean UX
                const pointerEvents = Math.cos(angle) > 0.82 ? 'auto' : 'none';

                transformStyle = {
                  transform: `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  pointerEvents: pointerEvents
                };
              }

              return (
                <div 
                  key={project.id} 
                  className="absolute w-[88vw] sm:w-[460px] md:w-[480px] lg:w-[500px] h-[390px] md:h-[430px] transition-all duration-700 ease-out"
                  style={{
                    ...transformStyle,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <Card className="flex flex-col justify-between h-full space-y-4 group relative overflow-hidden">
                    <ProjectCardVisualizer projectId={project.id} />
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4 flex-1">
                      <div className="space-y-3">
                        {/* Title and Badge */}
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-base md:text-lg font-bold text-textPrimary leading-snug group-hover:text-accentPurple transition-colors">
                            {project.title}
                          </h3>
                          <span className="text-[9px] font-mono py-0.5 px-2 bg-cardBg border border-cardBorder text-accentCyan uppercase rounded select-none shrink-0">
                            {project.category}
                          </span>
                        </div>

                        {/* 1-Line Summary */}
                        <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                          {project.summary}
                        </p>

                        {/* Technology Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((t, idx) => (
                            <Badge key={idx} name={t} className="px-2 py-0.5" />
                          ))}
                        </div>

                        {/* Highlights List */}
                        <div className="pt-2">
                          <ul className="text-[11px] text-textMuted font-mono space-y-1.5 list-disc list-inside">
                            {project.highlights.map((hl, idx) => (
                              <li key={idx} className="leading-relaxed">{hl}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Footer Block */}
                      {Object.keys(project.links).length > 0 && (
                        <div className="space-y-4 pt-3 border-t border-cardBorder/30">
                          {/* Resource Links */}
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(project.links).map(([key, link]) => renderLinkButton(key, link))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })
          )}
        </div>

        {/* Console-style Slide Indicator Dots */}
        {filteredProjects.length > 1 && (
          <div className="flex justify-center items-center gap-2 pt-2">
            {filteredProjects.map((_, idx) => (
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

export default Projects;

import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import ProjectCardVisualizer from '../components/ui/ProjectCardVisualizer';
import { projects } from '../data/projects';

const filters = [
  "All",
  "Data & Optimization",
  "Game Development",
  "Academic CS Projects",
  "Software Development"
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filter projects by checking the categories array
  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(project => project.categories.includes(activeFilter));

  // Reset scroll container position when filter changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      setScrollProgress(0);
    }
  }, [activeFilter]);

  const handleMouseDown = (e) => {
    // Avoid dragging issues when clicking on interactive elements like buttons/links
    if (e.target.closest('a') || e.target.closest('button')) return;
    setIsDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
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
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    setScrollProgress(container.scrollLeft / maxScroll);
  };

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount = 480; // Scroll distance per click
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
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

  return (
    <section id="projects" className="section-pad relative overflow-hidden border-t border-cardBorder">
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
            <div className="flex gap-2 font-mono text-[10px]">
              <button
                onClick={() => scroll('left')}
                className="px-3 py-1.5 border border-cardBorder bg-cardBg hover:bg-accentPurple/10 hover:border-accentPurple/50 text-textMuted hover:text-textPrimary transition-all duration-200 rounded-sm select-none cursor-pointer"
              >
                &lt;&lt; PREV
              </button>
              <button
                onClick={() => scroll('right')}
                className="px-3 py-1.5 border border-cardBorder bg-cardBg hover:bg-accentPurple/10 hover:border-accentPurple/50 text-textMuted hover:text-textPrimary transition-all duration-200 rounded-sm select-none cursor-pointer"
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

        {/* Projects Horizontal Slider */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          className="flex flex-row gap-6 overflow-x-auto scrollbar-none py-4 cursor-grab active:cursor-grabbing snap-x snap-mandatory relative z-10 select-none"
        >
          {filteredProjects.map((project, idx) => (
            <div key={project.id} className="snap-start flex-shrink-0 w-[88vw] md:w-[500px] lg:w-[540px]">
              <Card className="flex flex-col justify-between h-full space-y-6 group relative overflow-hidden">
                <ProjectCardVisualizer projectId={project.id} />
                <div className="relative z-10 flex flex-col justify-between h-full space-y-6 flex-1">
                  <div className="space-y-4">
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
                      <ul className="text-xs text-textMuted font-mono space-y-1.5 list-disc list-inside">
                        {project.highlights.map((hl, idx) => (
                          <li key={idx} className="leading-relaxed">{hl}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Block */}
                  {Object.keys(project.links).length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-cardBorder/30">
                      {/* Resource Links */}
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(project.links).map(([key, link]) => renderLinkButton(key, link))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty Search Fallback */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-cardBorder rounded-md">
            <p className="font-mono text-sm text-textMuted">// NO COMPATIBLE MODULES FOUND FOR SELECTED FILTER</p>
          </div>
        )}

        {/* Console-style Progress Tracker */}
        <div className="flex items-center justify-between font-mono text-[9px] text-textMuted pt-4 max-w-sm mx-auto">
          <span>[SYSTEM: MODULES_L]</span>
          <div className="w-48 h-[2px] bg-cardBorder relative overflow-hidden rounded-full mx-4">
            <div
              className="absolute top-0 bottom-0 left-0 bg-accentPurple transition-transform duration-100 origin-left"
              style={{ transform: `scaleX(${scrollProgress})`, width: '100%' }}
            />
          </div>
          <span>[SYSTEM: MODULES_R]</span>
        </div>

      </div>
    </section>
  );
};

export default Projects;

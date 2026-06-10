import React, { useRef, useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { skills } from '../data/skills';

const Skills = () => {
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleMouseDown = (e) => {
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
    const scrollAmount = 380; // Scroll distance per click
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="stack" className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="skills" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex justify-between items-end gap-4 border-b border-cardBorder pb-4">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Skills &amp; Technology Matrix</h2>
            <p className="text-xs text-textMuted font-mono mt-1 uppercase">// CURRENT DEVELOPMENT VECTORS &amp; PROFICIENCIES</p>
          </Reveal>

          {/* Slider Buttons */}
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

        {/* Horizontal scrollable track */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          className="flex flex-row gap-6 overflow-x-auto scrollbar-none py-4 cursor-grab active:cursor-grabbing snap-x snap-mandatory relative z-10 select-none"
        >
          {/* Card 1: Core Programming */}
          <div className="snap-start flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[400px]">
            <Card className="flex flex-col justify-between h-full space-y-4">
              <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Core Programming</h3>
              <div className="flex flex-wrap gap-2">
                {skills.coreProgramming.map((skill, idx) => (
                  <Badge key={idx} name={skill.name} level={skill.level} />
                ))}
              </div>
            </Card>
          </div>

          {/* Card 2: Data & Math */}
          <div className="snap-start flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[400px]">
            <Card className="flex flex-col justify-between h-full space-y-4">
              <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Data &amp; Mathematics</h3>
              <div className="flex flex-wrap gap-2">
                {skills.dataAndMath.map((skill, idx) => (
                  <Badge key={idx} name={skill.name} level={skill.level} />
                ))}
              </div>
            </Card>
          </div>

          {/* Card 3: AI / Automation Direction */}
          <div className="snap-start flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[400px]">
            <Card className="flex flex-col justify-between h-full space-y-4">
              <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// AI &amp; Automation Direction</h3>
              <div className="flex flex-wrap gap-2">
                {skills.aiAndAutomation.map((skill, idx) => (
                  <Badge key={idx} name={skill.name} level={skill.level} />
                ))}
              </div>
            </Card>
          </div>

          {/* Card 4: Tools I Use */}
          <div className="snap-start flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[400px]">
            <Card className="flex flex-col justify-between h-full space-y-4">
              <h3 className="font-mono text-xs font-bold text-textPrimary uppercase tracking-widest">// Tools I Use</h3>
              <div className="flex flex-wrap gap-2">
                {skills.toolsIUse.map((skill, idx) => (
                  <Badge key={idx} name={skill.name} level={skill.level} />
                ))}
              </div>
            </Card>
          </div>
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

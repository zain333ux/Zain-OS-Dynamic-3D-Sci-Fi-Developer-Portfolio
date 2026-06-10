import React, { useRef, useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { educationList } from '../data/education';

const Education = () => {
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
    const scrollAmount = 450; // Scroll distance per click
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="education" className="section-pad relative overflow-hidden border-t border-cardBorder">
      <CodeBackdrop type="education" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex justify-between items-end gap-4 border-b border-cardBorder pb-4">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// Education</h2>
            <p className="text-xs text-textMuted font-mono mt-1 uppercase">// ACADEMIC TIMELINE ROADMAP</p>
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

        {/* Roadmap Slider Container */}
        <div className="relative w-full">
          {/* Horizontal Line Connector */}
          <div className="absolute top-[26px] left-8 right-8 h-[2px] bg-cardBorder z-0" />

          {/* Scrollable track */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onScroll={handleScroll}
            className="flex flex-row gap-8 overflow-x-auto scrollbar-none py-4 cursor-grab active:cursor-grabbing snap-x snap-mandatory relative z-10 select-none"
          >
            {educationList.map((item, idx) => (
              <div key={item.id} className="snap-start flex-shrink-0 w-[88vw] md:w-[480px] group">
                {/* Node point aligned horizontally */}
                <div className="flex items-center h-6 mb-6 pl-6 relative">
                  <div className="w-3.5 h-3.5 bg-accentPurple rounded-full shadow-glowPurple border-2 border-bgDark group-hover:scale-110 transition-transform duration-300 relative z-10" />
                </div>

                <Card className="space-y-6 hover:border-accentPurple/40 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-textPrimary">{item.institution}</h3>
                      <p className="text-xs font-mono text-accentCyan mt-1">{item.degree}</p>
                    </div>
                    <span className="font-mono text-xs text-textMuted py-1 px-2.5 bg-cardBg border border-cardBorder rounded select-none">
                      {item.timeline}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xs font-mono text-textMuted leading-relaxed border-l-2 border-accentCyan/30 pl-3">
                      {item.details}
                    </div>

                    <div>
                      <h4 className="text-xs font-mono text-textPrimary uppercase tracking-widest mb-3">// Core Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.courses.map((course, idx) => (
                          <Badge key={idx} name={course} />
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-cardBorder pt-4">
                      <h4 className="text-xs font-mono text-textPrimary uppercase tracking-widest mb-2">// Focus &amp; Approach</h4>
                      <p className="text-sm text-textMuted leading-relaxed">
                        {item.approach}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Console-style Progress Tracker */}
        <div className="flex items-center justify-between font-mono text-[9px] text-textMuted pt-4 max-w-sm mx-auto">
          <span>[SYSTEM: ROADMAP_L]</span>
          <div className="w-48 h-[2px] bg-cardBorder relative overflow-hidden rounded-full mx-4">
            <div
              className="absolute top-0 bottom-0 left-0 bg-accentPurple transition-transform duration-100 origin-left"
              style={{ transform: `scaleX(${scrollProgress})`, width: '100%' }}
            />
          </div>
          <span>[SYSTEM: ROADMAP_R]</span>
        </div>

      </div>
    </section>
  );
};

export default Education;

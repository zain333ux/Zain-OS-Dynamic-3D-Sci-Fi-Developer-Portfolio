import React, { useEffect, useRef } from 'react';
import Card from '../components/ui/Card';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { gsap } from 'gsap';

const About = () => {
  const parallaxRef = useRef(null);
  const parallaxGridRef = useRef(null);
  const dialRef = useRef(null);
  const dialInnerRef = useRef(null);

  useEffect(() => {
    const el = parallaxRef.current;
    if (el) {
      gsap.fromTo(el,
        { y: -40 },
        {
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    const gridEl = parallaxGridRef.current;
    if (gridEl) {
      gsap.fromTo(gridEl,
        { y: 60, rotation: 0 },
        {
          y: -100,
          rotation: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    // Path tracing animations on scroll
    const dial = dialRef.current;
    if (dial) {
      gsap.fromTo(dial,
        { strokeDashoffset: 283 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }

    const dialInner = dialInnerRef.current;
    if (dialInner) {
      gsap.fromTo(dialInner,
        { strokeDashoffset: 0 },
        {
          strokeDashoffset: 238,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }
  }, []);

  return (
    <section id="about" className="section-pad relative overflow-hidden">
      <CodeBackdrop type="about" />
      
      {/* Parallax Background HUD Element 1: Rotating path-tracing dials */}
      <div 
        ref={parallaxRef} 
        className="absolute w-[300px] h-[300px] top-[15%] right-[-100px] opacity-[0.08] pointer-events-none select-none z-0 hidden md:block"
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="url(#dial-gradient)" 
            strokeWidth="0.8" 
            strokeDasharray="283" 
            ref={dialRef}
            className="transform origin-center animate-[spin_60s_linear_infinite]"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="38" 
            stroke="#618764" 
            strokeWidth="0.5" 
            strokeDasharray="238" 
            ref={dialInnerRef}
            className="transform origin-center animate-[spin_30s_linear_infinite_reverse]"
          />
          {/* Coordinate crosshairs */}
          <line x1="50" y1="5" x2="50" y2="95" stroke="#273338" strokeWidth="0.3" strokeDasharray="2 2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#273338" strokeWidth="0.3" strokeDasharray="2 2" />
          <defs>
            <linearGradient id="dial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9CB080" />
              <stop offset="100%" stopColor="#618764" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Parallax Background HUD Element 2: Tech Matrix Grid Backdrop */}
      <div 
        ref={parallaxGridRef} 
        className="absolute w-[400px] h-[300px] top-[45%] left-[-150px] opacity-[0.025] pointer-events-none select-none z-0 hidden md:block"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #9CB080 1px, transparent 1px), linear-gradient(to bottom, #9CB080 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold text-textPrimary tracking-wide">// About Me</h2>
          <p className="text-xs text-textMuted font-mono mt-1 uppercase">// LOGICAL BEDROCK &amp; CORE METRIC</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Bio Card */}
          <Reveal className="lg:col-span-8" delay={0.1}>
            <Card className="space-y-6 h-full">
              <h3 className="font-mono text-xs text-accentPurple uppercase tracking-widest">// Core Narrative</h3>
              <div className="space-y-4 text-sm text-textMuted leading-relaxed">
                <p>
                  I am a Computer Science student at FAST-NUCES Islamabad. I like learning how complex programs work behind the scenes and turning those ideas into clean, running code. My current academic projects focus on software programming, data analysis, and mathematical modeling.
                </p>
                <p>
                  Rather than just using pre-built tools, I enjoy building core systems myself—like coding a custom game loop in C++ or writing a gradient descent calculator in Python. I am currently learning about AI architectures, automation tools, and full-stack development to build intelligent, practical software systems.
                </p>
              </div>
            </Card>
          </Reveal>

          {/* Focus Areas Card */}
          <Reveal className="lg:col-span-4" delay={0.2}>
            <Card className="space-y-4 h-full">
              <h3 className="font-mono text-xs text-accentCyan uppercase tracking-widest">// Focus Zones</h3>
              <div className="font-mono text-xs text-textMuted space-y-3">
                <div>
                  <span className="text-textPrimary font-semibold">01. SYSTEMS DEVELOPMENT</span>
                  <p className="text-[11px] text-textMuted mt-1">C++, SFML, entity states, loops.</p>
                </div>
                <div className="border-t border-cardBorder pt-3">
                  <span className="text-textPrimary font-semibold">02. DATA SCIENCE &amp; MATH</span>
                  <p className="text-[11px] text-textMuted mt-1">Graph networks, optimization, calculus.</p>
                </div>
                <div className="border-t border-cardBorder pt-3">
                  <span className="text-textPrimary font-semibold">03. AI &amp; AUTOMATION</span>
                  <p className="text-[11px] text-textMuted mt-1">LLMs, agent workflows, script scripting.</p>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;

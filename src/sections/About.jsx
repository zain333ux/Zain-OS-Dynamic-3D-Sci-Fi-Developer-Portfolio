import React from 'react';
import Card from '../components/ui/Card';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';

const About = () => {
  return (
    <section id="about" className="section-pad relative overflow-hidden">
      <CodeBackdrop type="about" />
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

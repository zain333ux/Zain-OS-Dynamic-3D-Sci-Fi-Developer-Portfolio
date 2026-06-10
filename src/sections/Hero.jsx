import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';

// Custom typewriter component for the terminal loading effect
const Typewriter = ({ text, delay = 40 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

const Hero = () => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center pt-20 relative bg-mesh-gradient overflow-hidden"
    >
      <CodeBackdrop type="hero" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <Reveal className="max-w-3xl space-y-6" yOffset={25} duration={0.6}>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cardBg border border-cardBorder rounded-sm font-mono text-[10px] text-accentCyan tracking-wider uppercase min-h-[26px]">
            <Typewriter text="// INITIALIZING SYSTEM PORTFOLIO CORES..." delay={50} />
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs md:text-sm text-textMuted font-medium tracking-wider">
              Zain Ul Abideen // Aspiring AI Engineer &amp; Software Builder
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-textPrimary leading-[1.15]">
              Building Intelligent &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentPurple to-accentCyan">
                Practical Software Systems
              </span>
            </h1>
          </div>

          <p className="text-sm md:text-base text-textMuted leading-relaxed max-w-2xl">
            I am a BS Computer Science student at FAST-NUCES Islamabad, exploring AI, automation, software development, data analysis, and game systems through hands-on projects.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a href="#projects">
              <Button variant="primary">View Projects</Button>
            </a>
            <Button 
              variant="secondary" 
              href="/Zain_Ul_Abideen_CV.docx" 
              download="Zain_Ul_Abideen_CV.docx"
            >
              Download Resume
            </Button>
            <a href="#contact">
              <Button variant="secondary">Contact Me</Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;

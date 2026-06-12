import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import CodeBackdrop from '../components/ui/CodeBackdrop';
import { gsap } from 'gsap';

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
  const lettersRef = useRef([]);
  const subtitleRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    // 1. Kinetic Typography: Letter staggered assembly for ZAIN UL ABIDEEN
    const activeLetters = lettersRef.current.filter(Boolean);
    if (activeLetters.length > 0) {
      gsap.fromTo(activeLetters,
        {
          opacity: 0,
          y: 15,
          scale: 0.7,
          rotationX: -45,
          transformOrigin: '50% 50% -20px'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          stagger: 0.04,
          duration: 1.0,
          ease: 'power4.out',
          delay: 0.3
        }
      );
    }

    // 2. Tracking expansion on the name block
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        { letterSpacing: '0.05em' },
        {
          letterSpacing: '0.15em',
          duration: 1.8,
          ease: 'power3.out',
          delay: 0.3
        }
      );
    }

    // 3. Kinetic Word Compilation for the main tagline
    const activeWords = wordsRef.current.filter(Boolean);
    if (activeWords.length > 0) {
      gsap.fromTo(activeWords,
        {
          opacity: 0,
          x: -20,
          scaleX: 0.8,
          skewX: 10
        },
        {
          opacity: 1,
          x: 0,
          scaleX: 1,
          skewX: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.6
        }
      );
    }
  }, []);

  const nameString = "ZAIN UL ABIDEEN";
  const taglineWords = ["Exploring", "Code,", "AI,", "and", "Systems."];

  return (
    <section 
      id="home" 
      className="min-h-[100dvh] flex items-center pt-20 relative bg-mesh-gradient overflow-hidden"
    >
      <CodeBackdrop type="hero" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <Reveal className="max-w-3xl space-y-6" yOffset={25} duration={0.6}>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cardBg border border-cardBorder rounded-sm font-mono text-[10px] text-accentCyan tracking-wider uppercase min-h-[26px]">
            <Typewriter text="// INITIALIZING SYSTEM PORTFOLIO CORES..." delay={50} />
          </div>

          <div className="space-y-3">
            <div 
              ref={subtitleRef}
              className="font-mono text-xs md:text-sm text-textMuted font-medium flex flex-wrap items-center select-none"
            >
              <span className="flex flex-wrap mr-2">
                {nameString.split("").map((char, idx) => (
                  <span
                    key={idx}
                    ref={(el) => (lettersRef.current[idx] = el)}
                    className="inline-block"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              <span className="text-accentPurple font-bold">// Aspiring AI Engineer &amp; Software Builder</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-textPrimary leading-[1.15] select-none flex flex-wrap gap-x-3 gap-y-1">
              {taglineWords.map((word, idx) => {
                const isGradient = word === "AI," || word === "and" || word === "Systems.";
                return (
                  <span
                    key={idx}
                    ref={(el) => (wordsRef.current[idx] = el)}
                    className={`inline-block ${
                      isGradient 
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-accentPurple to-accentCyan" 
                        : "text-textPrimary"
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </h1>
          </div>

          <p className="text-sm md:text-base text-textMuted leading-relaxed max-w-2xl">
            I am a BS Computer Science student at FAST-NUCES Islamabad, exploring generative AI, machine learning, and automation through hands-on projects.
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

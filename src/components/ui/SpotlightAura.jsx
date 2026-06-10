import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SpotlightAura = ({ shouldReduceMotion }) => {
  const auraRef = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Track mouse coordinates to sway the backdrop
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Translate slightly relative to center to give an atmospheric depth feel
      const offsetX = (clientX - window.innerWidth / 2) * 0.15;
      const offsetY = (clientY - window.innerHeight / 2) * 0.15;

      gsap.to(auraRef.current, {
        x: offsetX,
        y: offsetY,
        duration: 3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll-linked vertical translation matching scroll bounds
    const scrollTween = gsap.to(auraRef.current, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
      translateY: () => {
        const docHeight = document.documentElement.scrollHeight;
        const viewHeight = window.innerHeight;
        // Float down a portion of scroll height so it stays elegantly relative
        return (docHeight - viewHeight) * 0.55;
      },
      ease: 'none',
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollTween.scrollTrigger) scrollTween.scrollTrigger.kill();
      scrollTween.kill();
    };
  }, [shouldReduceMotion]);

  return (
    <div 
      ref={auraRef}
      id="scroll-spotlight"
      className="fixed left-1/3 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-accentPurple/15 via-accentPurple/5 to-accentCyan/15 filter blur-[140px] pointer-events-none select-none z-[-2] opacity-80"
      aria-hidden="true"
    />
  );
};

export default SpotlightAura;

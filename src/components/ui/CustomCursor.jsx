import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const CustomCursor = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Position motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Springs for the outer lagging aura ring
  const ringX = useSpring(cursorX, { damping: 30, stiffness: 350, mass: 0.15 });
  const ringY = useSpring(cursorY, { damping: 30, stiffness: 350, mass: 0.15 });

  // Circumference calculation for radius r=19: C = 2 * PI * r = 119.38
  const circumference = 119.38;
  const strokeDashoffsetVal = useMotionValue(circumference);

  useEffect(() => {
    // Detect mobile touch devices to disable custom cursor
    const checkDevice = () => {
      setIsMobile(
        window.innerWidth < 768 || 
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0)
      );
    };
    checkDevice();

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('[role="button"]') ||
        target.closest('a') ||
        target.closest('button');
        
      setIsHovered(!!isInteractive);
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const pct = window.scrollY / totalScroll;
        strokeDashoffsetVal.set(circumference * (1 - pct));
      }
    };

    if (!isMobile && !shouldReduceMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseover', handleMouseOver, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial load check
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, shouldReduceMotion]);

  if (isMobile || shouldReduceMotion) return null;

  return (
    <>
      {/* Central Cursor Point */}
      <motion.div 
        className="fixed w-1.5 h-1.5 bg-accentCyan rounded-full z-[10000] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ 
          x: cursorX, 
          y: cursorY 
        }}
      />
      
      {/* Outer Lagging Aura Ring with Circular Scroll Progress */}
      <motion.div 
        className="fixed rounded-full z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden"
        style={{
          x: ringX,
          y: ringY,
          width: isHovered ? 40 : 24,
          height: isHovered ? 40 : 24,
          backgroundColor: isHovered ? 'rgba(6, 182, 212, 0.05)' : 'rgba(0,0,0,0)',
        }}
        animate={{
          width: isHovered ? 40 : 24,
          height: isHovered ? 40 : 24,
          backgroundColor: isHovered ? 'rgba(6, 182, 212, 0.05)' : 'rgba(0,0,0,0)',
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 350,
          mass: 0.15
        }}
      >
        <svg className="w-full h-full rotate-[-90deg] scale-[1.05]" viewBox="0 0 44 44" aria-hidden="true">
          {/* Background circle track */}
          <circle 
            cx="22" 
            cy="22" 
            r="19" 
            stroke="rgba(255, 255, 255, 0.06)" 
            strokeWidth="1.5" 
            fill="none" 
          />
          {/* Progress circle outline */}
          <motion.circle 
            cx="22" 
            cy="22" 
            r="19" 
            stroke={isHovered ? "#9CB080" : "#618764"} 
            strokeWidth="2.2" 
            fill="none"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: strokeDashoffsetVal
            }}
            animate={{
              stroke: isHovered ? "#9CB080" : "#618764",
              filter: isHovered ? 'drop-shadow(0 0 4px rgba(156, 176, 128, 0.6))' : 'none'
            }}
            transition={{ duration: 0.05 }}
          />
        </svg>
      </motion.div>
    </>
  );
};

export default CustomCursor;

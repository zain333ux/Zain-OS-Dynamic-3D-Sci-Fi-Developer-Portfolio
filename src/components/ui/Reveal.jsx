import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ─── TRANSITION PRESETS ─────────────────────────────────────────
const TRANSITIONS = {
  // Default: simple fade + slide up (original behavior)
  default: {
    initial: (yOffset) => ({ opacity: 0, y: yOffset }),
    animate: { opacity: 1, y: 0 },
    transition: (duration, delay) => ({
      duration,
      delay,
      ease: 'easeOut',
    }),
  },

  // Warp Zoom: rushes in from deep z-depth
  'warp-zoom': {
    initial: () => ({
      opacity: 0,
      scale: 0.65,
      y: 90,
      filter: 'blur(20px)',
    }),
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
    },
    transition: (duration, delay) => ({
      duration: duration * 1.5,
      delay,
      ease: [0.16, 1, 0.3, 1], // custom bezier for cinematic deceleration
    }),
  },

  // Glitch Slice: slides in with a glitchy horizontal offset
  'glitch-slice': {
    initial: () => ({
      opacity: 0,
      x: -80,
      skewX: -12,
      filter: 'blur(12px)',
    }),
    animate: {
      opacity: 1,
      x: 0,
      skewX: 0,
      filter: 'blur(0px)',
    },
    transition: (duration, delay) => ({
      duration: duration * 1.3,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }),
  },

  // Digital Dissolve: fades in with a scale-up and brightness burst
  'digital-dissolve': {
    initial: () => ({
      opacity: 0,
      scale: 0.85,
      y: 50,
      filter: 'brightness(2.5) contrast(1.2) blur(18px)',
    }),
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'brightness(1) blur(0px)',
    },
    transition: (duration, delay) => ({
      duration: duration * 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }),
  },

  // Slide Rise: smooth upward rise with subtle rotation
  'slide-rise': {
    initial: (yOffset) => ({
      opacity: 0,
      y: 110,
      rotateX: -24,
      transformPerspective: 800,
    }),
    animate: {
      opacity: 1,
      y: 0,
      rotateX: 0,
    },
    transition: (duration, delay) => ({
      duration: duration * 1.3,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }),
  },
};

// Map section indices to transition types for automatic assignment
const SECTION_TRANSITIONS = [
  'warp-zoom',       // Hero
  'glitch-slice',    // About
  'digital-dissolve',// Education
  'slide-rise',      // Skills
  'warp-zoom',       // Projects
  'glitch-slice',    // Learning
  'digital-dissolve',// Volunteering
  'slide-rise',      // Achievements
];

// Global counter to auto-assign transitions
let sectionCounter = 0;

const Reveal = ({ 
  children, 
  className = '', 
  delay = 0, 
  yOffset = 20, 
  duration = 0.85, // increased base duration for a premium slow-burn reveal
  transition: transitionType,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [hasEntered, setHasEntered] = useState(false);
  const assignedRef = useRef(null);

  // Auto-assign transition type if not specified
  if (!assignedRef.current) {
    assignedRef.current = transitionType ||
      SECTION_TRANSITIONS[sectionCounter % SECTION_TRANSITIONS.length];
    sectionCounter++;
  }

  const activeTransition = shouldReduceMotion ? 'default' : assignedRef.current;
  const preset = TRANSITIONS[activeTransition] || TRANSITIONS.default;

  // Reduced motion: bypass all effects
  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={preset.initial(yOffset)}
      whileInView={preset.animate}
      viewport={{ once: true, margin: "-18% 0px" }} // Triggers higher up on the screen so animation is fully visible
      transition={preset.transition(duration, delay)}
      onAnimationComplete={() => setHasEntered(true)}
      className={className}
      style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

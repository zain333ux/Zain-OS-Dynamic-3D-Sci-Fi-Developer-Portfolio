import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const Reveal = ({ 
  children, 
  className = '', 
  delay = 0, 
  yOffset = 20, 
  duration = 0.5 
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is active, bypass translation and scale entirely
  const initialStyles = {
    opacity: 0,
    y: shouldReduceMotion ? 0 : yOffset
  };

  const animateStyles = {
    opacity: 1,
    y: 0
  };

  return (
    <motion.div
      initial={initialStyles}
      whileInView={animateStyles}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ 
        duration: shouldReduceMotion ? 0.2 : duration, 
        delay: shouldReduceMotion ? 0 : delay,
        ease: "easeOut" 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

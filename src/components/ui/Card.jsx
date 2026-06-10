import React, { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  tag: Tag = 'div',
  onClick,
  ...props
}) => {
  const isInteractive = typeof onClick === 'function';
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current || shouldReduceMotion) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Mouse relative positions
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Bounds check
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate -5deg to 5deg max
    const rotateX = ((centerY - y) / centerY) * 5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`,
      transition: 'transform 0.1s ease-out',
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`,
      '--sheen-opacity': '1',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`,
      transition: 'transform 0.5s ease-in-out',
      '--mouse-x': '0px',
      '--mouse-y': '0px',
      '--sheen-opacity': '0',
    });
  };

  const baseStyle = "glass-card p-6 rounded-md relative overflow-hidden transition-all duration-300 neon-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentPurple focus-visible:ring-offset-2 focus-visible:ring-offset-bgDark";
  
  return (
    <Tag 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={tiltStyle}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive 
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={`${baseStyle} ${isInteractive ? 'cursor-pointer hover:border-accentPurple/40' : ''} ${className}`}
      {...props}
    >
      {/* CSS-Variables Driven Liquid Sheen Glow Overlay */}
      {!shouldReduceMotion && (
        <>
          <div 
            className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 opacity-[var(--sheen-opacity,0)] z-[1]"
            style={{
              background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(156, 176, 128, 0.08) 0%, rgba(97, 135, 100, 0.03) 60%, transparent 100%)`,
            }}
          />
          {/* Self-drawing SVG hover border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-[inherit] z-20" fill="none">
            <rect 
              x="0" 
              y="0" 
              width="100%" 
              height="100%" 
              rx="6" 
              pathLength="100"
              className="stroke-card-svg-border"
            />
          </svg>
        </>
      )}
      
      {/* Content wrapper to float above sheen */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </Tag>
  );
};

export default Card;

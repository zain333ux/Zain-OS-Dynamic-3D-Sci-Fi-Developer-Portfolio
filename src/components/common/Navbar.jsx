import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ScrambleText from '../ui/ScrambleText';
import { getAudioEnabled, setAudioEnabled, playHoverSound } from '../../utils/audio';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(() => getAudioEnabled());
  
  // Hook up scroll position progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  });

  const toggleAudio = () => {
    const nextState = !isAudioActive;
    setAudioEnabled(nextState);
    setIsAudioActive(nextState);
    if (nextState) {
      setTimeout(() => playHoverSound(), 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-card bg-bgDark/70 backdrop-blur-md border-b border-cardBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="font-mono text-textPrimary font-bold text-sm tracking-wider hover:text-accentPurple transition-colors">
          <a href="#home"><ScrambleText text="[ZAIN_UL_ABIDEEN]" /></a>
        </div>
        
        {/* Desktop Links & SFX Toggle */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-mono uppercase tracking-wider text-textMuted">
          <a href="#home" className="hover:text-accentPurple transition-colors">
            <ScrambleText text="01. Home" />
          </a>
          <a href="#about" className="hover:text-accentPurple transition-colors">
            <ScrambleText text="02. About" />
          </a>
          <a href="#stack" className="hover:text-accentPurple transition-colors">
            <ScrambleText text="03. Stack" />
          </a>
          <a href="#projects" className="hover:text-accentPurple transition-colors">
            <ScrambleText text="04. Projects" />
          </a>
          <a href="#contact" className="hover:text-accentPurple transition-colors">
            <ScrambleText text="05. Contact" />
          </a>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-cardBorder hover:border-accentPurple/50 bg-cardBg hover:bg-accentPurple/10 text-[9px] tracking-widest text-textMuted hover:text-textPrimary rounded-sm transition-all duration-300 cursor-pointer select-none font-bold font-mono"
            title="Toggle SFX feedback"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAudioActive ? 'bg-accentPurple shadow-glowPurple animate-pulse' : 'bg-red-500'}`} />
            <span>SFX: {isAudioActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1 text-textMuted hover:text-textPrimary transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-cardBorder bg-bgDark/95 px-4 pt-4 pb-6 space-y-4 text-xs font-mono uppercase tracking-wider text-textMuted flex flex-col">
          <a href="#home" onClick={() => setIsOpen(false)} className="hover:text-accentPurple transition-colors py-2 border-b border-white/5">
            <ScrambleText text="01. Home" />
          </a>
          <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-accentPurple transition-colors py-2 border-b border-white/5">
            <ScrambleText text="02. About" />
          </a>
          <a href="#stack" onClick={() => setIsOpen(false)} className="hover:text-accentPurple transition-colors py-2 border-b border-white/5">
            <ScrambleText text="03. Stack" />
          </a>
          <a href="#projects" onClick={() => setIsOpen(false)} className="hover:text-accentPurple transition-colors py-2 border-b border-white/5">
            <ScrambleText text="04. Projects" />
          </a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-accentPurple transition-colors py-2">
            <ScrambleText text="05. Contact" />
          </a>

          {/* Mobile Sound Toggle Button */}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 justify-center w-full py-2 border border-cardBorder bg-cardBg text-[9px] tracking-widest text-textMuted rounded-sm font-bold font-mono"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAudioActive ? 'bg-accentPurple shadow-glowPurple animate-pulse' : 'bg-red-500'}`} />
            <span>SFX: {isAudioActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      )}

      {/* GPU Accelerated Scroll Progress Indicator */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accentCyan origin-[0%] z-50"
        style={{ scaleX }}
      />
    </nav>
  );
};

export default Navbar;

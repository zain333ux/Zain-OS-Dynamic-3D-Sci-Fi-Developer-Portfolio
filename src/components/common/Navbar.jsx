import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ScrambleText from '../ui/ScrambleText';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Hook up scroll position progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-card bg-bgDark/70 backdrop-blur-md border-b border-cardBorder relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="font-mono text-textPrimary font-bold text-sm tracking-wider hover:text-accentPurple transition-colors">
          <a href="#home"><ScrambleText text="[ZAIN_UL_ABIDEEN]" /></a>
        </div>
        
        {/* Desktop Links */}
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

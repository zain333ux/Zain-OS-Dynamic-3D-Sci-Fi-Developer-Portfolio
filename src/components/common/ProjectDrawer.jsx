import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../ui/Button';

const ProjectDrawer = ({ project, isOpen, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when drawer is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const renderLinkButton = (key, link) => {
    const isComingSoon = link.type === 'coming-soon';
    
    // Label translations for cleaner display
    const labels = {
      github: { active: "View GitHub ↗", placeholder: "GitHub Coming Soon" },
      report: { active: "Open Report ↗", placeholder: "Report Coming Soon" },
      notebook: { active: "Open Notebook ↗", placeholder: "Notebook Coming Soon" },
      demo: { active: "View Demo ↗", placeholder: "Demo Coming Soon" }
    };

    const displayLabel = isComingSoon 
      ? labels[key]?.placeholder || "Coming Soon" 
      : labels[key]?.active || "Open Asset ↗";

    if (isComingSoon) {
      return (
        <Button 
          key={key} 
          variant="placeholder" 
          title="This resource is being finalized and will be uploaded soon."
          className="w-full sm:w-auto text-[10px]"
        >
          {displayLabel}
        </Button>
      );
    }

    return (
      <Button 
        key={key} 
        variant="secondary" 
        isExternal
        href={link.url}
        className="w-full sm:w-auto text-[10px]"
      >
        {displayLabel.replace(" ↗", "")} {/* Button component appends arrow automatically */}
      </Button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Slide-out Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="relative w-full h-full bg-bgDark border-l border-cardBorder p-6 md:p-8 overflow-y-auto z-10 shadow-2xl flex flex-col justify-between
                       min-w-[320px] max-w-full md:min-w-[420px] md:max-w-[620px] md:w-[45vw]"
          >
            <div>
              {/* Header block with close controls */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-[10px] text-textMuted uppercase tracking-wider">// PROJECT DETAILED READOUT</span>
                <button 
                  onClick={onClose} 
                  className="p-1 text-textMuted hover:text-accentPurple transition-colors rounded focus-visible:ring-2 focus-visible:ring-accentPurple"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Main Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-textPrimary leading-snug">{project.title}</h2>
                  <p className="text-xs text-accentCyan font-mono mt-1 uppercase tracking-wider">{project.category}</p>
                </div>
                
                <div className="space-y-5 text-xs md:text-sm text-textMuted leading-relaxed">
                  <div>
                    <h4 className="text-[11px] font-mono text-textPrimary uppercase tracking-widest mb-1.5">// Overview</h4>
                    <p>{project.overview}</p>
                  </div>
                  <div className="border-t border-cardBorder/30 pt-4">
                    <h4 className="text-[11px] font-mono text-textPrimary uppercase tracking-widest mb-1.5">// What I Built</h4>
                    <p>{project.whatIBuilt}</p>
                  </div>
                  <div className="border-t border-cardBorder/30 pt-4">
                    <h4 className="text-[11px] font-mono text-textPrimary uppercase tracking-widest mb-1.5">// What I Learned</h4>
                    <p>{project.whatILearned}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech chips & links at bottom */}
            <div className="mt-8 pt-6 border-t border-cardBorder">
              <div className="mb-6">
                <h4 className="text-[11px] font-mono text-textPrimary uppercase tracking-widest mb-3">// Technologies Applied</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="px-2 py-1 bg-cardBg border border-cardBorder rounded text-[10px] font-mono text-textMuted select-none">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                {Object.entries(project.links).map(([key, link]) => renderLinkButton(key, link))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDrawer;

import { useState, useEffect, useRef, useCallback } from 'react';

const COMMANDS = [
  {
    id: 'matrix',
    icon: '🔴',
    name: 'Matrix Rain',
    description: 'Enter the Matrix digital rain simulation',
    shortcut: "type 'matrix'",
  },
  {
    id: 'glitch',
    icon: '⚡',
    name: 'Glitch Mode',
    description: 'Trigger chromatic aberration distortion',
    shortcut: "type 'glitch'",
  },
  {
    id: 'snake',
    icon: '🐍',
    name: 'Snake Game',
    description: 'Play Snake in the terminal console',
    shortcut: "type 'snake'",
  },
  {
    id: 'hack',
    icon: '⚠️',
    name: 'Hack Simulation',
    description: 'Run a simulated penetration test',
    shortcut: "type 'hack'",
  },
  {
    id: 'download-cv',
    icon: '📄',
    name: 'Download CV',
    description: "Fetch Zain's resume document",
    shortcut: "type 'download-cv'",
  },
  {
    id: 'theme-dynamic',
    icon: '🌈',
    name: 'Theme: Dynamic Scroll Sync',
    description: 'Accent colors shift dynamically as you scroll',
    shortcut: 'scroll sync',
  },
  {
    id: 'theme-neon',
    icon: '🔮',
    name: 'Theme: Cyber Neon',
    description: 'Lock accent color to high-energy purple-magenta',
    shortcut: 'preset neon',
  },
  {
    id: 'theme-sage',
    icon: '🌱',
    name: 'Theme: Sage Green',
    description: 'Lock accent color to classic stealth terminal green',
    shortcut: 'preset sage',
  },
  {
    id: 'theme-cyber',
    icon: '🌐',
    name: 'Theme: Tech Cyan',
    description: 'Lock accent color to luminous electric cyan',
    shortcut: 'preset cyan',
  },
  {
    id: 'theme-graphite',
    icon: '🌑',
    name: 'Theme: Stealth Graphite',
    description: 'Lock accent color to dark monochrome silver-gray',
    shortcut: 'preset graphite',
  },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filteredCommands = COMMANDS.filter((cmd) => {
    const query = search.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.id.toLowerCase().includes(query)
    );
  });

  // Focus input when opened & reset state
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      // Small delay to ensure the DOM is painted before focusing
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-command-item]');
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const executeCommand = useCallback(
    (cmd) => {
      switch (cmd.id) {
        case 'matrix':
          window.dispatchEvent(new CustomEvent('easter-egg-matrix'));
          break;

        case 'glitch':
          window.dispatchEvent(new CustomEvent('easter-egg-glitch'));
          break;

        case 'snake': {
          const contactSection = document.querySelector('#contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
          window.dispatchEvent(
            new CustomEvent('palette-command', { detail: 'snake' })
          );
          break;
        }

        case 'hack': {
          const contactEl = document.querySelector('#contact');
          if (contactEl) {
            contactEl.scrollIntoView({ behavior: 'smooth' });
          }
          window.dispatchEvent(
            new CustomEvent('palette-command', { detail: 'hack' })
          );
          break;
        }

        case 'download-cv': {
          const link = document.createElement('a');
          link.href = '/Zain_Ul_Abideen_CV.docx';
          link.download = 'Zain_Ul_Abideen_CV.docx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        }

        case 'theme-dynamic':
          window.dispatchEvent(new CustomEvent('change-theme', { detail: 'dynamic' }));
          break;

        case 'theme-neon':
          window.dispatchEvent(new CustomEvent('change-theme', { detail: 'neon' }));
          break;

        case 'theme-sage':
          window.dispatchEvent(new CustomEvent('change-theme', { detail: 'sage' }));
          break;

        case 'theme-cyber':
          window.dispatchEvent(new CustomEvent('change-theme', { detail: 'cyber' }));
          break;

        case 'theme-graphite':
          window.dispatchEvent(new CustomEvent('change-theme', { detail: 'graphite' }));
          break;

        default:
          break;
      }

      onClose();
    },
    [onClose]
  );

  const handleKeyNavigation = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] transition-all duration-300 ${
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bgDark/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className={`relative w-full max-w-[500px] mx-4 rounded-xl border border-cardBorder bg-bgDark/90 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300 ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : '-translate-y-4 scale-95 opacity-0'
        }`}
        onKeyDown={handleKeyNavigation}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-accentPurple font-mono text-xs tracking-wider mb-1">
            {'// COMMAND PALETTE'}
          </p>
          <p className="text-textMuted font-mono text-[10px] tracking-wide">
            Press ESC or click outside to dismiss
          </p>
        </div>

        {/* Search Input */}
        <div className="px-4 pb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted text-sm">
              {'❯'}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command..."
              className="w-full bg-cardBg/60 border border-cardBorder rounded-lg py-2.5 pl-8 pr-4 text-textPrimary font-mono text-sm placeholder:text-textMuted/50 focus:outline-none focus:border-accentPurple/60 focus:ring-1 focus:ring-accentPurple/30 transition-colors"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-cardBorder mx-4" />

        {/* Command List */}
        <div
          ref={listRef}
          className="py-2 max-h-[320px] overflow-y-auto scrollbar-thin"
        >
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-textMuted font-mono text-sm">
                No commands found
              </p>
              <p className="text-textMuted/50 font-mono text-xs mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                data-command-item
                onClick={() => executeCommand(cmd)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors duration-150 cursor-pointer group ${
                  index === selectedIndex
                    ? 'bg-accentPurple/10 border-l-2 border-accentPurple'
                    : 'border-l-2 border-transparent hover:bg-accentPurple/5'
                }`}
              >
                {/* Icon */}
                <span className="text-lg flex-shrink-0 w-7 text-center">
                  {cmd.icon}
                </span>

                {/* Name + Description */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-mono text-sm truncate transition-colors ${
                      index === selectedIndex
                        ? 'text-accentPurple'
                        : 'text-textPrimary group-hover:text-accentPurple'
                    }`}
                  >
                    {cmd.name}
                  </p>
                  <p className="font-mono text-[11px] text-textMuted truncate mt-0.5">
                    {cmd.description}
                  </p>
                </div>

                {/* Shortcut Badge */}
                <span className="flex-shrink-0 font-mono text-[10px] text-textMuted/70 bg-bgDark/60 border border-cardBorder rounded px-2 py-0.5 hidden sm:inline-block">
                  {cmd.shortcut}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="h-px bg-cardBorder mx-4" />
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-textMuted/50 flex items-center gap-1">
              <kbd className="bg-bgDark border border-cardBorder rounded px-1 py-0.5 text-textMuted text-[9px]">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="font-mono text-[10px] text-textMuted/50 flex items-center gap-1">
              <kbd className="bg-bgDark border border-cardBorder rounded px-1 py-0.5 text-textMuted text-[9px]">
                ↵
              </kbd>
              select
            </span>
            <span className="font-mono text-[10px] text-textMuted/50 flex items-center gap-1">
              <kbd className="bg-bgDark border border-cardBorder rounded px-1 py-0.5 text-textMuted text-[9px]">
                esc
              </kbd>
              close
            </span>
          </div>
          <span className="font-mono text-[10px] text-accentCyan/60">
            {filteredCommands.length} command
            {filteredCommands.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

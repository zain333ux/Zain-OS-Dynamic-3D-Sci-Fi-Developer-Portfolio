import React, { useState, useEffect, useRef } from 'react';

const BOOT_MESSAGES = [
  'ZAIN-OS [Version 1.0.4]',
  '(c) 2026 Zain Ul Abideen. All systems operational.',
  '',
  "Type 'help' to view available operations.",
  ''
];

const InteractiveConsole = () => {
  const [history, setHistory] = useState(() => {
    return BOOT_MESSAGES.map(msg => ({ text: msg, type: 'system' }));
  });
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const consoleEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Handle focusing the hidden input on clicking the console
  const handleConsoleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = inputVal.trim();
      if (!command) return;

      // Add command to log history
      setHistory(prev => [...prev, { text: `guest@zain-os:~$ ${command}`, type: 'command' }]);
      setCmdHistory(prev => [command, ...prev]);
      setHistoryIdx(-1);
      setInputVal('');

      // Process command
      processCommand(command.toLowerCase());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const processCommand = (cmd) => {
    const parts = cmd.split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        setHistory(prev => [
          ...prev,
          { text: 'Available commands:', type: 'system' },
          { text: '  about       - Learn about Zain\'s background', type: 'output' },
          { text: '  skills      - View technical competencies matrix', type: 'output' },
          { text: '  projects    - List core software engineering projects', type: 'output' },
          { text: '  contact     - Display social channels and contact options', type: 'output' },
          { text: '  download-cv - Fetch Zain\'s resume document', type: 'output' },
          { text: '  clear       - Clear the screen buffer', type: 'output' },
          { text: '  help        - Show this manual page', type: 'output' }
        ]);
        break;
      case 'about':
        setHistory(prev => [
          ...prev,
          { text: 'Zain Ul Abideen -- BS Computer Science Student at FAST-NUCES Islamabad.', type: 'output' },
          { text: 'Focus zones: Systems development, data analysis, and mathematical modeling.', type: 'output' },
          { text: 'Enjoys coding core mechanisms from scratch (custom game loops, optimization graphs, regression math).', type: 'output' }
        ]);
        break;
      case 'skills':
        setHistory(prev => [
          ...prev,
          { text: 'ZAIN CORE SKILLS MATRIX', type: 'system' },
          { text: '-------------------------------------------------------------', type: 'system' },
          { text: '  [PROGRAMMING]   C++, Python, JavaScript (ES6+), HTML5/CSS3', type: 'output' },
          { text: '  [DATA & MATH]   Graph Networks, Optimization, Calculus', type: 'output' },
          { text: '  [AI / AGENTS]   LLM workflows, Automation Scripts, LangChain', type: 'output' },
          { text: '  [TOOLS & INFRA] Git, Docker, Node.js, Linux CLI', type: 'output' },
          { text: '-------------------------------------------------------------', type: 'system' }
        ]);
        break;
      case 'projects':
        setHistory(prev => [
          ...prev,
          { text: 'ZAIN CORE PROJECT DEPLOYMENTS', type: 'system' },
          { text: '----------------------------------------------------------------------', type: 'system' },
          { text: '  PROJECT NAME             ROLE / DESCRIPTION         LINK', type: 'system' },
          { text: '  ----------------------------------------------------------------------', type: 'system' },
          { text: '  CPI Dynamics             Graph-Vector Modeling      [GitHub / LinkedIn]', type: 'output' },
          { text: '  Gradient Descent         3D Optimization Schematic  [Live Demo]', type: 'output' },
          { text: '  Latency Optimizer        Stretched Routing Graph    [Technical Report]', type: 'output' },
          { text: '  Metal Slug Engine        C++/SFML Bounding Collider [GitHub]', type: 'output' },
          { text: '  Tumble Pop               Physics Particle Vortex    [GitHub]', type: 'output' },
          { text: '  ----------------------------------------------------------------------', type: 'system' },
          { text: "  * Type 'contact' or scroll above to access live URLs.", type: 'system' }
        ]);
        break;
      case 'contact':
        setHistory(prev => [
          ...prev,
          { text: 'COMMUNICATIONS CHANNELS:', type: 'system' },
          { text: '-------------------------------------------------------------', type: 'system' },
          { text: '  Gmail      : uzain6268@gmail.com', type: 'output' },
          { text: '  GitHub     : github.com/uzain6268', type: 'output' },
          { text: '  LinkedIn   : linkedin.com/in/zain-ul-abideen-ai', type: 'output' },
          { text: '-------------------------------------------------------------', type: 'system' }
        ]);
        break;
      case 'download-cv':
        setHistory(prev => [
          ...prev,
          { text: 'Initializing download request...', type: 'system' },
          { text: 'Asset resolved: /Zain_Ul_Abideen_CV.docx', type: 'output' },
          { text: 'Transfer complete. File saved to downloads directory.', type: 'output' }
        ]);
        triggerCVDownload();
        break;
      case 'clear':
        setHistory([]);
        break;
      default:
        setHistory(prev => [
          ...prev,
          { text: `bash: command not found: ${mainCmd}. Type 'help' for options.`, type: 'system' }
        ]);
    }
  };

  const triggerCVDownload = () => {
    const link = document.createElement('a');
    link.href = '/Zain_Ul_Abideen_CV.docx';
    link.download = 'Zain_Ul_Abideen_CV.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      onClick={handleConsoleClick}
      className="glass-card bg-bgDark/90 border border-cardBorder rounded-sm p-4 w-full max-w-3xl mx-auto font-mono text-[11px] leading-relaxed text-textMuted text-left cursor-text select-text h-[280px] flex flex-col justify-between"
    >
      {/* Console Window Header Controls */}
      <div className="flex justify-between items-center border-b border-cardBorder pb-2 mb-2 select-none pointer-events-none">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="text-[10px] text-textMuted tracking-wider uppercase font-bold">
          [guest@zain-os: ~] // SYSTEM INTERACTION SHELL
        </div>
      </div>

      {/* Console Terminal Screen Log */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cardBorder">
        {history.map((line, idx) => {
          let lineClass = 'text-textMuted';
          if (line.type === 'command') {
            lineClass = 'text-textPrimary font-semibold';
          } else if (line.type === 'system') {
            lineClass = 'text-accentPurple';
          } else if (line.type === 'output') {
            lineClass = 'text-[#9CB080]'; // Sage Green terminal output
          }
          return (
            <div key={idx} className={`${lineClass} whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}
        <div ref={consoleEndRef} />
      </div>

      {/* Input Prompter */}
      <div className="flex items-center pt-2 border-t border-cardBorder select-none mt-2">
        <span className="text-textPrimary font-bold mr-2">guest@zain-os:~$</span>
        <div className="flex-1 flex items-center relative">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-[#9CB080] caret-transparent font-mono text-[11px]"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {/* Custom Blinking Caret Cursor */}
          <span 
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none w-1.5 h-3.5 bg-[#9CB080] animate-pulse"
            style={{ 
              left: `${Math.min(inputVal.length * 6.6, inputRef.current?.getBoundingClientRect().width || 0)}px` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveConsole;

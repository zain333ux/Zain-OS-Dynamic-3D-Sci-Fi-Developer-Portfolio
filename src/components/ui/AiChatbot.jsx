import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Button from './Button';
import { getAiResponse } from '../../utils/aiAgent';
import { playClick, playHoverSound } from '../../utils/audio';
import { MessageSquare, X, Send, Terminal } from 'lucide-react';

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "ACCESS PROTOCOL: Zain-OS AI Assistant initialized.\nI can answer questions regarding Zain's academic background, project catalog, skills, and contact channels.\nHow may I assist you today?",
      isTyping: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isDecryptionActive, setIsDecryptionActive] = useState(false);
  const [decryptionText, setDecryptionText] = useState('');
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat window to the bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDecryptionActive, decryptionText]);

  // Handle suggestion chip clicks
  const handleSuggestionClick = (query) => {
    playClick();
    submitQuery(query);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    playClick();
    submitQuery(inputValue);
    setInputValue('');
  };

  const submitQuery = (query) => {
    // Add user query to chat history
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);

    // Trigger matrix decryption scramble loading state
    setIsDecryptionActive(true);
    let duration = 0;
    const chars = '$&%@#!=?*+-/\\<>[]{}|';
    
    const scrambleInterval = setInterval(() => {
      duration += 100;
      let randStr = '[Decrypting AI Cores...] ';
      for (let i = 0; i < 12; i++) {
        randStr += chars[Math.floor(Math.random() * chars.length)];
      }
      setDecryptionText(randStr);
      
      // Play high frequency ticks during scramble
      if (Math.random() < 0.3) {
        playHoverSound();
      }

      if (duration >= 900) {
        clearInterval(scrambleInterval);
        setIsDecryptionActive(false);
        setDecryptionText('');
        
        // Fetch AI Response and start typewriter effect
        const aiAnswer = getAiResponse(query);
        typewriterResponse(aiAnswer);
      }
    }, 100);
  };

  const typewriterResponse = (fullText) => {
    // Initialize empty message placeholder
    setMessages((prev) => [...prev, { sender: 'ai', text: '', isTyping: true }]);
    
    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += 2; // append 2 characters at a time to speed it up slightly
      const chunk = fullText.slice(0, currentLength);
      
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.isTyping) {
          last.text = chunk;
          if (currentLength >= fullText.length) {
            last.isTyping = false;
            clearInterval(interval);
          }
        }
        return next;
      });

      // Play soft mechanical keyboard typewriter ticks
      if (Math.random() < 0.4) {
        playClick();
      }
    }, 20);
  };

  return (
    <div 
      className="fixed bottom-24 right-6 z-40 select-none flex flex-col items-end"
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {/* Expanded Chat Dialog Box */}
      {isOpen && (
        <div 
          className="glass-card bg-bgDark/95 border border-accentPurple/40 shadow-glowPurple w-[310px] sm:w-[350px] h-[440px] rounded-lg mb-4 flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-cardBg border-b border-cardBorder p-3">
            <div className="flex items-center gap-2 text-accentPurple text-[10px] font-bold tracking-widest w-full">
              <Terminal className="w-3.5 h-3.5 text-accentPurple animate-pulse" />
              <span>// COGNITIVE_AGENT.DAT</span>
              {messages[messages.length - 1]?.isTyping && (
                <div className="flex items-end gap-[2px] h-2.5 ml-auto mr-3">
                  <span 
                    className="w-[2px] bg-accentPurple rounded-sm origin-bottom animate-[soundwave_0.6s_ease-in-out_infinite]" 
                    style={{ animationDelay: '0.1s', height: '6px' }} 
                  />
                  <span 
                    className="w-[2px] bg-accentPurple rounded-sm origin-bottom animate-[soundwave_0.6s_ease-in-out_infinite]" 
                    style={{ animationDelay: '0.3s', height: '8px' }} 
                  />
                  <span 
                    className="w-[2px] bg-accentPurple rounded-sm origin-bottom animate-[soundwave_0.6s_ease-in-out_infinite]" 
                    style={{ animationDelay: '0.5s', height: '5px' }} 
                  />
                </div>
              )}
            </div>
            <button 
              onClick={() => { playClick(); setIsOpen(false); }}
              className="text-textMuted hover:text-red-400 transition-colors p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Logs Window */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-[11px] md:text-xs">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[8px] text-textMuted uppercase mb-0.5 tracking-wider font-bold">
                  {msg.sender === 'user' ? 'guest@client:~#' : 'system@ai:~#'}
                </span>
                <div 
                  className={`max-w-[85%] p-2.5 rounded-sm whitespace-pre-wrap leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-accentPurple/10 text-accentPurple border border-accentPurple/30'
                      : 'bg-accentCyan/5 text-textPrimary border border-accentCyan/20'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Scramble Decryptor Loading Overlay */}
            {isDecryptionActive && (
              <div className="flex flex-col items-start">
                <span className="text-[8px] text-textMuted uppercase mb-0.5 tracking-wider font-bold">
                  system@ai:~#
                </span>
                <div className="bg-accentCyan/5 text-accentCyan border border-accentCyan/20 p-2.5 rounded-sm font-bold tracking-widest text-[9px] animate-pulse">
                  {decryptionText}
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions Chips Panel */}
          {messages.length === 1 && !isDecryptionActive && (
            <div className="px-4 py-2 border-t border-cardBorder/30 flex flex-col gap-1.5 bg-cardBg/30">
              <span className="text-[8px] text-textMuted uppercase tracking-widest">// QUICK QUERY NODES:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSuggestionClick("Tell me about your projects")}
                  className="px-2 py-1 bg-bgDark border border-cardBorder hover:border-accentCyan/50 text-accentCyan text-[9px] rounded-sm transition-colors cursor-pointer"
                >
                  [ PROJECTS ]
                </button>
                <button
                  onClick={() => handleSuggestionClick("What are your skills")}
                  className="px-2 py-1 bg-bgDark border border-cardBorder hover:border-accentPurple/50 text-accentPurple text-[9px] rounded-sm transition-colors cursor-pointer"
                >
                  [ SKILLS ]
                </button>
                <button
                  onClick={() => handleSuggestionClick("Where do you study")}
                  className="px-2 py-1 bg-bgDark border border-cardBorder hover:border-textPrimary text-textPrimary text-[9px] rounded-sm transition-colors cursor-pointer"
                >
                  [ EDUCATION ]
                </button>
              </div>
            </div>
          )}

          {/* Input Form Footer */}
          <form 
            onSubmit={handleSend}
            className="p-3 border-t border-cardBorder bg-cardBg/60 flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me a question..."
              className="flex-1 bg-bgDark border border-cardBorder rounded-sm py-1.5 px-3 text-textPrimary text-[11px] placeholder:text-textMuted/50 focus:outline-none focus:border-accentPurple/50 focus:ring-1 focus:ring-accentPurple/30 transition-colors"
              autoComplete="off"
              disabled={isDecryptionActive || messages[messages.length - 1]?.isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isDecryptionActive || messages[messages.length - 1]?.isTyping}
              className="p-2 border border-accentPurple/30 bg-accentPurple/10 hover:bg-accentPurple hover:text-bgDark text-accentPurple disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 rounded-sm cursor-pointer shadow-glowPurple"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating launcher trigger bubble button */}
      <button
        onClick={() => {
          playHoverSound();
          setIsOpen(prev => !prev);
        }}
        className={`w-12 h-12 rounded-full border border-cardBorder hover:border-accentPurple/60 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg group relative ${
          isOpen 
            ? 'bg-accentPurple text-bgDark rotate-90 shadow-glowPurple border-accentPurple' 
            : 'bg-bgDark/90 hover:bg-bgDark text-accentPurple hover:text-textPrimary hover:scale-105'
        }`}
        title="Consult AI Knowledge Agent"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" />
        )}
        
        {/* Floating tooltip hover label */}
        {!isOpen && (
          <div className="absolute right-14 bg-bgDark/95 border border-cardBorder rounded px-2 py-1 text-[8px] text-accentPurple uppercase tracking-widest font-mono opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none select-none whitespace-nowrap shadow-sm">
            // ASK_AI_AGENT
          </div>
        )}
      </button>
    </div>
  );
}

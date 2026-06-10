import React, { useState, useEffect, useRef } from 'react';


const ScrambleText = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const chars = '$&%@#!=?*+-/\\<>[]{}|';

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    let iteration = 0;
    const length = text.length;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      if (iteration >= length) {
        clearInterval(intervalRef.current);
      }
      

      iteration += 1 / 2; // Scramble increments
    }, 22);
  };

  const handleMouseEnter = () => {
    startScramble();
  };

  useEffect(() => {
    setDisplayText(text);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span 
      onMouseEnter={handleMouseEnter} 
      className={`inline-block font-mono ${className}`}
    >
      {displayText}
    </span>
  );
};

export default ScrambleText;

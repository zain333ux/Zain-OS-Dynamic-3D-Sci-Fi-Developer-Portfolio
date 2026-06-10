import React from 'react';

const Badge = ({ name, level, className = '' }) => {
  return (
    <div className={`inline-flex flex-col items-start px-2.5 py-1.5 bg-cardBg border border-cardBorder rounded select-none hover:border-accentCyan/40 transition-colors ${className}`}>
      <span className="text-[11px] font-mono text-textPrimary leading-none font-semibold">{name}</span>
      {level && (
        <span className="text-[8px] font-mono text-textMuted mt-1 uppercase tracking-wider leading-none select-none">
          {level}
        </span>
      )}
    </div>
  );
};

export default Badge;

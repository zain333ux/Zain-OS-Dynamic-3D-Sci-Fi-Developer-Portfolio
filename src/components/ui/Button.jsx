import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  href,
  variant = 'primary', 
  isExternal = false, 
  disabled = false, 
  className = '',
  type = 'button',
  ...props
}) => {
  const isLink = !!href && variant !== 'placeholder';
  const Tag = isLink ? 'a' : 'button';
  
  const baseStyle = "inline-flex items-center justify-center px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 relative select-none border font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentPurple focus-visible:ring-offset-2 focus-visible:ring-offset-bgDark";
  
  const variants = {
    primary: "border-accentPurple text-textPrimary hover:bg-accentPurple/15 hover:shadow-glowPurple active:scale-95",
    secondary: "border-accentCyan text-textPrimary hover:bg-accentCyan/15 hover:shadow-glowCyan active:scale-95",
    placeholder: "border-dashed border-white/20 text-textMuted cursor-not-allowed opacity-50"
  };

  const extraProps = isLink 
    ? {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        ...props
      }
    : {
        type,
        onClick: !disabled && variant !== 'placeholder' ? onClick : undefined,
        disabled: disabled || variant === 'placeholder',
        ...props
      };

  return (
    <Tag className={`${baseStyle} ${variants[variant]} ${className}`} {...extraProps}>
      <span>{children}</span>
      {isExternal && variant !== 'placeholder' && (
        <ArrowUpRight className="ml-1.5 w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
      )}
    </Tag>
  );
};

export default Button;

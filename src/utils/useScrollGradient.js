import { useEffect, useRef } from 'react';

if (typeof window !== 'undefined') {
  window.__accentColors = window.__accentColors || {
    primary: 'rgb(156, 176, 128)',
    secondary: 'rgb(97, 135, 100)',
    primaryRGB: '156, 176, 128',
    secondaryRGB: '97, 135, 100'
  };
}

// Section color zones — each zone defines a scroll range and two accent colors to blend
const COLOR_ZONES = [
  { start: 0,   end: 0.15, from: [8, 145, 178],   to: [6, 182, 212]   }, // Hero: deep cyan
  { start: 0.15, end: 0.30, from: [5, 150, 105],   to: [16, 185, 129]  }, // About/Edu: emerald
  { start: 0.30, end: 0.50, from: [156, 176, 128],  to: [97, 135, 100]  }, // Skills: sage green (original)
  { start: 0.50, end: 0.70, from: [139, 92, 246],   to: [168, 85, 247]  }, // Projects: purple
  { start: 0.70, end: 0.85, from: [217, 119, 6],    to: [245, 158, 11]  }, // Learning/Vol: amber
  { start: 0.85, end: 1.00, from: [225, 29, 72],    to: [244, 63, 94]   }, // Achievements/Contact: rose
];

function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function getAccentColors(scrollPct) {
  // Clamp
  const pct = Math.max(0, Math.min(1, scrollPct));

  // Find current zone
  for (const zone of COLOR_ZONES) {
    if (pct >= zone.start && pct <= zone.end) {
      const zoneProgress = (pct - zone.start) / (zone.end - zone.start);
      const primary = lerpColor(zone.from, zone.to, zoneProgress);
      // Secondary is secondary endpoint of current zone, or a reversed blend
      const secondary = lerpColor(zone.to, zone.from, zoneProgress * 0.4);
      return { primary, secondary };
    }
  }

  // Blend between zones (in the gap between zone.end and next zone.start)
  for (let i = 0; i < COLOR_ZONES.length - 1; i++) {
    const curr = COLOR_ZONES[i];
    const next = COLOR_ZONES[i + 1];
    if (pct > curr.end && pct < next.start) {
      const gapProgress = (pct - curr.end) / (next.start - curr.end);
      const primary = lerpColor(curr.to, next.from, gapProgress);
      const secondary = lerpColor(curr.from, next.to, gapProgress);
      return { primary, secondary };
    }
  }

  return {
    primary: COLOR_ZONES[COLOR_ZONES.length - 1].to,
    secondary: COLOR_ZONES[COLOR_ZONES.length - 1].from
  };
}

export default function useScrollGradient() {
  const prevColor = useRef('');
  const prevColorSec = useRef('');

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const activeTheme = sessionStorage.getItem('portfolio-theme') || 'dynamic';
      let r, g, b;
      let r2, g2, b2;

      if (activeTheme === 'dynamic') {
        const totalH = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = totalH > 0 ? window.scrollY / totalH : 0;
        const colors = getAccentColors(scrollPct);
        [r, g, b] = colors.primary;
        [r2, g2, b2] = colors.secondary;
      } else {
        // Static preset colors
        const colors = {
          neon: { primary: [224, 0, 255], secondary: [139, 92, 246] },      // Cyber magenta-purple / Purple
          sage: { primary: [156, 176, 128], secondary: [97, 135, 100] },     // Sage green / Forest Green
          cyber: { primary: [0, 240, 255], secondary: [0, 150, 200] },      // Tech cyan / deep cyan
          graphite: { primary: [115, 133, 135], secondary: [75, 85, 90] },  // Stealth monochrome silver-gray / dark charcoal
        };
        const themeColors = colors[activeTheme] || colors.sage;
        [r, g, b] = themeColors.primary;
        [r2, g2, b2] = themeColors.secondary;
      }

      const colorStr = `${r}, ${g}, ${b}`;
      const colorStrSec = `${r2}, ${g2}, ${b2}`;

      // Only update DOM if colors actually changed
      if (colorStr !== prevColor.current || colorStrSec !== prevColorSec.current) {
        prevColor.current = colorStr;
        prevColorSec.current = colorStrSec;
        const style = document.documentElement.style;
        style.setProperty('--accent-dynamic', `rgb(${colorStr})`);
        style.setProperty('--accent-dynamic-rgb', colorStr);
        style.setProperty('--accent-dynamic-glow', `rgba(${colorStr}, 0.15)`);
        style.setProperty('--accent-dynamic-glow-strong', `rgba(${colorStr}, 0.3)`);
        
        style.setProperty('--accent-dynamic-secondary', `rgb(${colorStrSec})`);
        style.setProperty('--accent-dynamic-secondary-rgb', colorStrSec);
        style.setProperty('--accent-dynamic-glow-secondary', `rgba(${colorStrSec}, 0.22)`);

        const colorsDetail = {
          primary: `rgb(${colorStr})`,
          secondary: `rgb(${colorStrSec})`,
          primaryRGB: colorStr,
          secondaryRGB: colorStrSec
        };
        window.__accentColors = colorsDetail;
        window.dispatchEvent(new CustomEvent('accent-colors-updated', { detail: colorsDetail }));
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleThemeChange = (e) => {
      const theme = e.detail;
      sessionStorage.setItem('portfolio-theme', theme);
      update();
    };

    // Listeners
    window.addEventListener('change-theme', handleThemeChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial run on mount
    update();

    return () => {
      window.removeEventListener('change-theme', handleThemeChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}

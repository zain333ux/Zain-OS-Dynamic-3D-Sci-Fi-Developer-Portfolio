import React, { useState, useEffect, Suspense } from 'react';
import { useReducedMotion } from 'framer-motion';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Education from './sections/Education';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Learning from './sections/Learning';
import Volunteering from './sections/Volunteering';
import Achievements from './sections/Achievements';
import BackToTop from './components/ui/BackToTop';
import Autopilot from './components/ui/Autopilot';
import CustomCursor from './components/ui/CustomCursor';
import Preloader from './components/ui/Preloader';
import SpotlightAura from './components/ui/SpotlightAura';
import MatrixRain from './components/ui/MatrixRain';
import LiveTerminal from './components/ui/LiveTerminal';
import CommandPalette from './components/ui/CommandPalette';
import HudOverlay from './components/ui/HudOverlay';
import NebulaBackground from './components/ui/NebulaBackground';
import AiChatbot from './components/ui/AiChatbot';

// Import Lenis smooth scroll and GSAP
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playClick, playHoverSound, startScrollHum } from './utils/audio';
import useScrollGradient from './utils/useScrollGradient';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Lazy load the global 3D WebGL Canvas
const LatticeCanvas = React.lazy(() => import('./components/canvas/LatticeMesh'));

function App() {
  const [isMobile, setIsMobile] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const [isBooted, setIsBooted] = useState(() => {
    return sessionStorage.getItem('portfolio-booted') === 'true';
  });
  const [showMatrix, setShowMatrix] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  // Dynamic scroll-based gradient color system
  useScrollGradient();

  // Reset scroll to top on first load & disable browser auto-restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Ambient SFX Event Listeners
  useEffect(() => {
    if (!isBooted) return;

    // 1. Play soft beep on hovering over interactive elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], .cursor-pointer, input, select');
      if (target) {
        if (target.classList.contains('glass-card')) {
          return;
        }
        if (!target.dataset.audioHovered) {
          playHoverSound();
          target.dataset.audioHovered = 'true';
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, [role="button"], .cursor-pointer, input, select');
      if (target) {
        if (target.classList.contains('glass-card')) {
          return;
        }
        delete target.dataset.audioHovered;
      }
    };

    // 2. Play tactile typewriter keyclick on click
    const handleMouseDown = (e) => {
      const target = e.target.closest('a, button, [role="button"], .cursor-pointer');
      if (target) {
        if (target.classList.contains('glass-card')) {
          return;
        }
        playClick();
      }
    };

    // 3. Play click sound when typing inside inputs (like the CLI console)
    const handleKeyDown = (e) => {
      const target = e.target.closest('input, textarea');
      if (target) {
        if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace') {
          playClick();
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBooted]);

  // Easter Egg Event Listeners
  useEffect(() => {
    if (!isBooted) return;

    const handleMatrixEgg = () => {
      setShowMatrix(true);
    };

    const handleGlitchEgg = () => {
      document.body.classList.add('glitch-active');
      setTimeout(() => {
        document.body.classList.remove('glitch-active');
      }, 3000);
    };

    window.addEventListener('easter-egg-matrix', handleMatrixEgg);
    window.addEventListener('easter-egg-glitch', handleGlitchEgg);

    return () => {
      window.removeEventListener('easter-egg-matrix', handleMatrixEgg);
      window.removeEventListener('easter-egg-glitch', handleGlitchEgg);
    };
  }, [isBooted]);

  // Command Palette: Ctrl+K shortcut + custom event from Navbar badge
  useEffect(() => {
    if (!isBooted) return;

    const handleCtrlK = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
    };

    const handleOpenPalette = () => {
      setShowPalette(true);
    };

    window.addEventListener('keydown', handleCtrlK);
    window.addEventListener('open-command-palette', handleOpenPalette);

    return () => {
      window.removeEventListener('keydown', handleCtrlK);
      window.removeEventListener('open-command-palette', handleOpenPalette);
    };
  }, [isBooted]);

  useEffect(() => {
    // Skip smooth scrolling if prefers-reduced-motion is active or not booted yet
    if (shouldReduceMotion || !isBooted) return;

    // Force scroll to top before Lenis initializes
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      lerp: 0.08,
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
    });
    window.lenis = lenis;

    // Immediately reset Lenis scroll position to top
    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();

      // Hook scroll telemetry hum
      startScrollHum(e.velocity);
    });

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.lenis = null;
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
    };
  }, [shouldReduceMotion, isBooted]);

  // Cinematic 3D staggered heading reveals
  useEffect(() => {
    if (!isBooted || shouldReduceMotion) return;

    const headings = document.querySelectorAll('main h2, footer h2');
    
    headings.forEach((heading) => {
      // Split header text into words wrapped in spans for staggered 3D fold-outs
      const words = heading.textContent.split(' ');
      heading.innerHTML = words
        .map(word => `<span class="inline-block overflow-hidden mr-2"><span class="reveal-word inline-block">${word}</span></span>`)
        .join(' ');

      const revealWords = heading.querySelectorAll('.reveal-word');

      gsap.fromTo(revealWords,
        {
          y: '100%',
          rotationX: -60,
          z: -60,
          opacity: 0,
          transformOrigin: 'top center',
        },
        {
          y: '0%',
          rotationX: 0,
          z: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isBooted, shouldReduceMotion]);

  return (
    <div className="bg-bgDark min-h-screen text-textPrimary selection:bg-accentPurple/30 overflow-x-hidden">
      {!shouldReduceMotion && <div id="film-grain" aria-hidden="true" />}
      {!isBooted && <Preloader onComplete={() => setIsBooted(true)} />}

      {/* Easter Egg: Matrix Rain Overlay */}
      {showMatrix && <MatrixRain onDismiss={() => setShowMatrix(false)} />}

      {/* Command Palette Overlay (Ctrl+K) */}
      <CommandPalette isOpen={showPalette} onClose={() => setShowPalette(false)} />

      {/* Nebula: Animated cosmic gradient at z-index 0 (deepest layer) */}
      {isBooted && !shouldReduceMotion && <NebulaBackground />}

      {/* Live IDE Terminal Background — persistent typing animation at z-index 1 */}
      {isBooted && !shouldReduceMotion && <LiveTerminal />}

      {/* Floating dynamic back-light spotlight aura */}
      {isBooted && <SpotlightAura shouldReduceMotion={shouldReduceMotion} />}

      {/* Dynamic 3D WebGL background floating throughout the entire portfolio */}
      {!isMobile && isBooted && (
        <Suspense fallback={null}>
          <LatticeCanvas shouldReduceMotion={shouldReduceMotion} />
        </Suspense>
      )}

      {/* Custom glowing cursor aura (hidden on mobile, disabled on reduced motion) */}
      {isBooted && <CustomCursor />}

      {/* Navigation Menu Header */}
      {isBooted && <Navbar />}

      {/* Floating Sci-Fi HUD Overlay (desktop only, pointer-events: none) */}
      {isBooted && <HudOverlay />}
      
      {/* Content Layout Sections */}
      {isBooted && (
        <main className="relative z-10" style={{ perspective: '1000px' }}>
          <Hero />
          <About />
          <Education />
          <Skills />
          <Projects />
          <Learning />
          <Volunteering />
          <Achievements />
        </main>
      )}

      {/* Floating Action Elements */}
      {isBooted && <BackToTop />}
      {isBooted && <Autopilot />}
      {isBooted && <AiChatbot />}

      {/* Terminal Contact Footer */}
      {isBooted && <Footer />}
    </div>
  );
}

export default App;

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
import CustomCursor from './components/ui/CustomCursor';
import Preloader from './components/ui/Preloader';
import SpotlightAura from './components/ui/SpotlightAura';

// Import Lenis smooth scroll and GSAP
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Skip smooth scrolling if prefers-reduced-motion is active or not booted yet
    if (shouldReduceMotion || !isBooted) return;

    const lenis = new Lenis({
      lerp: 0.08,
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
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

      {/* Terminal Contact Footer */}
      {isBooted && <Footer />}
    </div>
  );
}

export default App;

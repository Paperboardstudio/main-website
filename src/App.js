import React, { Suspense, lazy, useRef, useState, useEffect, useMemo, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

import { Header } from './pages/Header/Header';

gsap.registerPlugin(ScrollTrigger);

// Early iOS detection (synchronous)
const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes('mac') && 'ontouchend' in document);
};

// Lenis context for smooth scroll
const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

// Lazy load heavy components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const TransitionPage = lazy(() => import('./pages/TransitionPage/TransitionPage'));
const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const ClaritAppPrivacy = lazy(() => import('./pages/ClaritAppPrivacy/ClaritAppPrivacy'));

// Loading placeholder that matches the black background
const SectionFallback = ({ height = '100vh' }) => (
  <div style={{
    height,
    background: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }} />
);

// IntersectionObserver-based lazy section loader
// On iOS: smaller rootMargin to prevent loading everything at once when scrolling fast
const LazySection = ({ children, height = '100vh', rootMargin = '200px', iosRootMargin = '50px', fallback }) => {
  const ref = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const isIOS = useMemo(() => isIOSDevice(), []);
  const effectiveMargin = isIOS ? iosRootMargin : rootMargin;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: effectiveMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [effectiveMargin]);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {shouldLoad ? children : (fallback || <SectionFallback height={height} />)}
    </div>
  );
};

// Section that unmounts its children when scrolled far past (memory optimization for iOS)
const UnmountableSection = ({ children, height = '100vh', fallback }) => {
  const ref = useRef(null);
  const [shouldRender, setShouldRender] = useState(true);
  const isIOS = useMemo(() => isIOSDevice(), []);

  useEffect(() => {
    // Only enable unmounting behavior on iOS to save memory
    if (!isIOS) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Unmount when section is far above viewport (user scrolled past)
        // Re-mount when section comes back into view
        setShouldRender(entry.isIntersecting || entry.boundingClientRect.top > 0);
      },
      { rootMargin: '100px 0px 0px 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isIOS]);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {shouldRender ? children : (fallback || <SectionFallback height={height} />)}
    </div>
  );
};

const HomePage = () => {
  const [lenis, setLenis] = useState(null);
  const isIOS = useMemo(() => isIOSDevice(), []);

  // Initialize Lenis smooth scroll on document body (disabled on iOS for performance)
  useEffect(() => {
    if (isIOS) return;

    // Lightweight Lenis config for better performance
    const lenisInstance = new Lenis({
      duration: 1.0, // Shorter duration = less processing
      easing: (t) => 1 - Math.pow(1 - t, 3), // Simpler cubic ease-out
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1, // Default multiplier
      lerp: 0.1, // Linear interpolation factor (0.1 = smooth, 1 = instant)
    });

    // Throttled ScrollTrigger update (every 2nd frame for performance)
    let frameCount = 0;
    const throttledUpdate = () => {
      frameCount++;
      if (frameCount % 2 === 0) {
        ScrollTrigger.update();
      }
    };
    lenisInstance.on('scroll', throttledUpdate);

    // Use requestAnimationFrame directly (lighter than GSAP ticker)
    let rafId;
    const raf = (time) => {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    setLenis(lenisInstance);

    // Single delayed refresh
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimeout);
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
    };
  }, [isIOS]);

  return (
    <LenisContext.Provider value={lenis}>
      <div
        className="app"
        style={{
          minHeight: '100vh',
          // Use native smooth scroll on iOS
          scrollBehavior: isIOS ? 'smooth' : 'auto'
        }}
      >
        <Header />

        {/* Landing section - unmounts on iOS when scrolled past to free GPU memory */}
        <UnmountableSection height="100vh">
          <section style={{ height: '100vh' }} id="home" className="section-anchor">
            <Suspense fallback={<SectionFallback />}>
              <LandingPage />
            </Suspense>
          </section>
        </UnmountableSection>

        {/* Transition section - lazy load when approaching, unmounts when scrolled past */}
        <UnmountableSection height="100vh">
          <LazySection height="100vh" rootMargin="300px" iosRootMargin="100px">
            <section style={{ height: '100vh' }}>
              <Suspense fallback={<SectionFallback />}>
                <TransitionPage />
              </Suspense>
            </section>
          </LazySection>
        </UnmountableSection>

        {/* Main section (Services + Portfolio) - lazy load when approaching */}
        <LazySection height="100vh" rootMargin="400px" iosRootMargin="150px">
          <section style={{ minHeight: '100vh' }}>
            <Suspense fallback={<SectionFallback />}>
              <MainPage />
            </Suspense>
          </section>
        </LazySection>
      </div>
    </LenisContext.Provider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SectionFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/claritapp-privacy" element={<ClaritAppPrivacy />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

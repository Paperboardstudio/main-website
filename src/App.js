import React, { Suspense, lazy, useRef, useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { Header } from './pages/Header/Header';

// Early iOS detection (synchronous)
const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes('mac') && 'ontouchend' in document);
};

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
  return (
    <div className="app" style={{ overflow: 'auto', overflowX: 'hidden', height: '100vh', scrollBehavior: 'smooth' }}>
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

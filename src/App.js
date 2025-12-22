import React, { Suspense, lazy, useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { Header } from './pages/Header/Header';

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
const LazySection = ({ children, height = '100vh', rootMargin = '200px', fallback }) => {
  const ref = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

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
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {shouldLoad ? children : (fallback || <SectionFallback height={height} />)}
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="app" style={{ overflow: 'auto', overflowX: 'hidden', height: '100vh', scrollBehavior: 'smooth' }}>
      <Header />

      {/* Landing section - load immediately (above the fold) */}
      <section style={{ height: '100vh' }} id="home" className="section-anchor">
        <Suspense fallback={<SectionFallback />}>
          <LandingPage />
        </Suspense>
      </section>

      {/* Transition section - lazy load when approaching */}
      <LazySection height="100vh" rootMargin="300px">
        <section style={{ height: '100vh' }}>
          <Suspense fallback={<SectionFallback />}>
            <TransitionPage />
          </Suspense>
        </section>
      </LazySection>

      {/* Main section (Services + Portfolio) - lazy load when approaching */}
      <LazySection height="100vh" rootMargin="400px">
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

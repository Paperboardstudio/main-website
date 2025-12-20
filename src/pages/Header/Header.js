// Header.js
import React, { useEffect, useRef } from 'react';
import './Header.scss';

export const Header = () => {
  const headerRef = useRef(null);

  // Track scroll without causing React re-renders
  const lastScrollY = useRef(0);
  const isAutoScrolling = useRef(false);

  // Small internal state for DOM-only class toggling
  const isHiddenRef = useRef(false);
  const rafIdRef = useRef(null);

  // Toggle the hidden class directly on the header element (no React state)
  const setHidden = (hidden) => {
    if (!headerRef.current) return;
    if (isHiddenRef.current === hidden) return; // avoid pointless DOM writes

    isHiddenRef.current = hidden;
    headerRef.current.classList.toggle('header--hidden', hidden);
  };

  // Keep a CSS variable updated with the REAL header height
  useEffect(() => {
    const setHeaderVar = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 0;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };

    setHeaderVar();

    const ro = new ResizeObserver(() => setHeaderVar());
    if (headerRef.current) ro.observe(headerRef.current);

    window.addEventListener('resize', setHeaderVar);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setHeaderVar);
    };
  }, []);

  // Scroll listener that does NOT call setState
  useEffect(() => {
    const onScroll = () => {
      if (isAutoScrolling.current) return;

      // throttle to 1x per frame
      if (rafIdRef.current != null) return;

      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;

        const y = window.scrollY;

        // hide when scrolling down past threshold
        const shouldHide = y > lastScrollY.current && y > 100;

        setHidden(shouldHide);
        lastScrollY.current = y;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const handleAnchorClick = (e) => {
    e.preventDefault();

    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const targetId = href.slice(1);
    const el = document.getElementById(targetId);

    if (!el) {
      console.warn(`[Header] No element found with id="${targetId}".`);
      return;
    }

    // Keep header visible during programmatic scroll (DOM-only)
    isAutoScrolling.current = true;
    setHidden(false);

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Re-enable auto-hide after the smooth scroll likely finishes
    window.setTimeout(() => {
      isAutoScrolling.current = false;
      lastScrollY.current = window.scrollY;

      // Optional: recompute hide state immediately after finishing
      // setHidden(window.scrollY > 100 && window.scrollY > lastScrollY.current);
    }, 900);
  };

  return (
    <header ref={headerRef} className="header">
      <nav className="header__nav">
        <div className="header__nav-left">
          <a href="#home" className="header__nav-logo" onClick={handleAnchorClick}>
            <img
              src="/PaperboardStudio_logo_nobg_whiteoutline.png"
              alt="Paperboard Studio Logo"
              loading="eager"
              decoding="async"
            />
          </a>
        </div>

        <div className="header__nav-right">
          <a href="#services" className="header__nav-link" onClick={handleAnchorClick}>
            Services
          </a>
          <a href="#portfolio" className="header__nav-link" onClick={handleAnchorClick}>
            Portfolio
          </a>
          <a href="#contact" className="header__nav-link" onClick={handleAnchorClick}>
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
};
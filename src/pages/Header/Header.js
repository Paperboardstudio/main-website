import React, { useEffect, useRef, useState } from 'react';
import './Header.scss';

export const Header = () => {
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);
  const isAutoScrolling = useRef(false);

  const [scrollDirection, setScrollDirection] = useState('up');

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

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isAutoScrolling.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollDirection(
            currentScrollY > lastScrollY.current && currentScrollY > 100 ? 'down' : 'up'
          );
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

    // Keep header visible during programmatic scroll
    isAutoScrolling.current = true;
    setScrollDirection('up');

    // Most robust scrolling method (works with window scroll OR scroll containers)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Re-enable auto-hide after the smooth scroll has likely finished
    window.setTimeout(() => {
      isAutoScrolling.current = false;
      lastScrollY.current = window.scrollY;
    }, 900);
  };

  return (
    <header
      ref={headerRef}
      className={`header ${scrollDirection === 'down' ? 'header--hidden' : ''}`}
    >
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
import React, { useEffect, useState, useRef } from 'react';
import './Header.scss';

export const Header = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setScrollDirection('down');
          } else {
            setScrollDirection('up');
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrollDirection === 'down' ? 'header--hidden' : ''}`}>
      <nav className="header__nav">
        {}
        <div className="header__nav-left">
          <a href="#home" className="header__nav-logo">
            <img src="/PaperboardStudio_logo.png" alt="Paperboard Studio Logo" loading="eager" decoding="async" />
          </a>
        </div>

        {}
        <div className="header__nav-right">
          <a href="#services" className="header__nav-link">Services</a>
          <a href="#portfolio" className="header__nav-link">Portfolio</a>
          <a href="#contact" className="header__nav-link">Contact</a>
        </div>
      </nav>
    </header>
  );
};
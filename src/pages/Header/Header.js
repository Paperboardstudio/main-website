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

  const handleAnchorClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      
      // Special handling for contact - scroll to bottom
      if (targetId === 'contact') {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
        return;
      }
      
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = 80; // Approximate header height including padding
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <header className={`header ${scrollDirection === 'down' ? 'header--hidden' : ''}`}>
      <nav className="header__nav">
        {}
        <div className="header__nav-left">
          <a href="#home" className="header__nav-logo">
            <img src="/PaperboardStudio_logo_nobg_whiteoutline.png" alt="Paperboard Studio Logo" loading="eager" decoding="async" />
          </a>
        </div>

        {}
        <div className="header__nav-right">
          <a href="#services" className="header__nav-link" onClick={handleAnchorClick}>Services</a>
          <a href="#portfolio" className="header__nav-link" onClick={handleAnchorClick}>Portfolio</a>
          <a href="#contact" className="header__nav-link" onClick={handleAnchorClick}>Contact</a>
        </div>
      </nav>
    </header>
  );
};
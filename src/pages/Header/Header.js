import React, { useEffect, useState } from 'react';
import './Header.scss';

export const Header = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`header ${scrollDirection === 'down' ? 'header--hidden' : ''}`}>
      <nav className="header__nav">
        <a href="#home" className="header__nav-link">Home</a>
        <a href="#services" className="header__nav-link">Services</a>
        <a href="#portfolio" className="header__nav-link">Portfolio</a>
        <a href="#contact" className="header__nav-link">Contact</a>
      </nav>
    </header>
  );
};
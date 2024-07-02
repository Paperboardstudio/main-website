import React from 'react';
import './Footer.scss';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__about">
          <h2 className="footer__title">About Us</h2>
          <p className="footer__text">We are a startup committed to delivering innovative solutions to our clients. Our team is dedicated to driving success through creativity and cutting-edge technology.</p>
        </div>
        <div className="footer__links">
          <h2 className="footer__title">Quick Links</h2>
          <ul className="footer__list">
            <li className="footer__item"><a href="#home" className="footer__link">Home</a></li>
            <li className="footer__item"><a href="#services" className="footer__link">Services</a></li>
            <li className="footer__item"><a href="#portfolio" className="footer__link">Portfolio</a></li>
            <li className="footer__item"><a href="#contact" className="footer__link">Contact</a></li>
          </ul>
        </div>
        <div className="footer__contact">
          <h2 className="footer__title">Contact Us</h2>
          <p className="footer__text">Email: <a href="mailto:info@startup.com" className="footer__link">info@startup.com</a></p>
          <p className="footer__text">Phone: <a href="tel:+123456789" className="footer__link">+123 456 789</a></p>
          <div className="footer__social">
            <a href="https://facebook.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__text">&copy; 2024 Startup. All rights reserved.</p>
      </div>
    </footer>
  );
};

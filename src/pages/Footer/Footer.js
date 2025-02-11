import React from 'react';
import './Footer.scss';

const footerData = {
  about: {
    title: 'Delight, Innovate, & Inspire.',
  },
  quickLinks: [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#contact', label: 'Contact' },
  ],
  contact: {
    title: 'Contact Us',
    email: 'contact@paperboardstudio.com',
    phone: '+358',
    social: [
      { href: 'https://facebook.com', label: 'Facebook' },
      { href: 'https://twitter.com', label: 'Twitter' },
      { href: 'https://linkedin.com', label: 'LinkedIn' },
    ],
  },
  copyright: '2025. All rights reserved.',
};

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__about">
          <h2 className="footer__title">{footerData.about.title}</h2>
          <p className="footer__text">{footerData.about.text}</p>
        </div>
        <div className="footer__links">
          <h2 className="footer__title">Quick Links</h2>
          <ul className="footer__list">
            {footerData.quickLinks.map((link, index) => (
              <li className="footer__item" key={index}>
                <a href={link.href} className="footer__link">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__contact">
          <h2 className="footer__title">{footerData.contact.title}</h2>
          <p className="footer__text">
            Email: <a href={`mailto:${footerData.contact.email}`} className="footer__link">{footerData.contact.email}</a>
          </p>
          <p className="footer__text">
            Phone: <a href={`tel:${footerData.contact.phone}`} className="footer__link">{footerData.contact.phone}</a>
          </p>
          <div className="footer__social">
            {footerData.contact.social.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__text">{footerData.copyright}</p>
      </div>
    </footer>
  );
};

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PortfolioPage.scss';

gsap.registerPlugin(ScrollTrigger);

const portfolioItems = [
  {
    image: '/images/Image1.png', 
    title: 'ClaritApp: Mobile POS',
  },
  {
    image: '/images/Image2.png',
    title: 'Car Dealership AR',
  },
  {
    image: '/images/Image3.png', 
    title: 'Distant Paradise: Mobile game',
  },
];

export const Portfolio = () => {
  useEffect(() => {
    const items = gsap.utils.toArray('.portfolio-highlights__item');
    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: "left center",
            end: "right center",
            toggleActions: "play none none reverse",
            scroller: ".portfolio-highlights", 
          },
        }
      );
    });
  }, []);

  return (
    <section className="portfolio-highlights">
      {/* Section Title */}
      <h2 className="portfolio-highlights__section-title">Our Portfolio</h2>
      <div className="portfolio-highlights__container">
        {portfolioItems.map((item, index) => (
          <div className="portfolio-highlights__item" key={index}>
            <img
              src={item.image}
              alt={item.title}
              className="portfolio-highlights__image"
            />
            <h3 className="portfolio-highlights__item-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
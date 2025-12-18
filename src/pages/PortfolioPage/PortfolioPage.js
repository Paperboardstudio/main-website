import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PortfolioPage.scss';

gsap.registerPlugin(ScrollTrigger);

const portfolioItems = [
  {
    image: '/images/portfolio1.webp', 
    title: 'ClaritApp: Mobile POS',
  },
  {
    image: '/images/portfolio2.webp',
    title: 'Car Dealership AR',
  },
  {
    image: '/images/portfolio3.webp', 
    title: 'Distant Paradise: Mobile game',
  },
];

export const Portfolio = () => {
  useEffect(() => {
    const items = gsap.utils.toArray('.portfolio-highlights__item');
    const animations = items.map((item) => {
      return gsap.fromTo(
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

    return () => {
      animations.forEach((anim) => {
        if (anim.scrollTrigger) {
          anim.scrollTrigger.kill();
        }
        anim.kill();
      });
    };
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
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchpriority={index === 0 ? "high" : "auto"}
            />
            <h3 className="portfolio-highlights__item-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
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
    let animations = [];
    let timeoutId;

    // Use requestAnimationFrame to ensure DOM is ready
    const initAnimations = () => {
      const items = gsap.utils.toArray('.portfolio-highlights__item');
      if (items.length === 0) return;

      animations = items.map((item) => {
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
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none none",
              // Remove scroller option - use default window scroll
            },
          }
        );
      });

      // Refresh ScrollTrigger after setup to recalculate positions
      ScrollTrigger.refresh();
    };

    // Delay initialization slightly to ensure DOM is ready
    timeoutId = setTimeout(() => {
      requestAnimationFrame(initAnimations);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      // Clean up all animations
      animations.forEach((anim) => {
        if (anim && anim.scrollTrigger) {
          anim.scrollTrigger.kill();
        }
        if (anim) {
          anim.kill();
        }
      });
      animations = [];
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
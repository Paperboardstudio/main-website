import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BlurUpImage } from '../../components/BlurUpImage';
import { ScrollReveal } from '../../components/ScrollReveal';
import './PortfolioPage.scss';

const Portfolio = () => {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const imageLoadCountRef = useRef(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const portfolioItems = useMemo(
    () => [
      {
        eyebrow: 'Mobile POS',
        title: 'ClaritApp',
        image: '/images/portfolio1.webp',
      },
      {
        eyebrow: 'Augmented Reality',
        title: 'Car Dealership AR',
        image: '/images/portfolio2.webp',
      },
      {
        eyebrow: 'Mobile Game',
        title: 'Distant Paradise',
        image: '/images/portfolio3.webp',
      },
    ],
    []
  );

  const totalImages = portfolioItems.length;

  // Debounced ScrollTrigger refresh function
  const debouncedRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      cancelAnimationFrame(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      refreshTimeoutRef.current = null;
    });
  }, []);

  // Track image loads and refresh once after all are loaded
  const handleImageLoad = useCallback(() => {
    imageLoadCountRef.current += 1;
    if (imageLoadCountRef.current >= totalImages) {
      debouncedRefresh();
    }
  }, [debouncedRefresh, totalImages]);

  const updatePaddles = useCallback(() => {
    const el = railRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    updatePaddles();

    const el = railRef.current;
    if (!el) return;

    el.addEventListener('scroll', updatePaddles, { passive: true });
    window.addEventListener('resize', updatePaddles);

    return () => {
      el.removeEventListener('scroll', updatePaddles);
      window.removeEventListener('resize', updatePaddles);
    };
  }, [updatePaddles]);

  // Refresh ScrollTrigger after content loads
  useEffect(() => {
    if (!sectionRef.current) return;

    const timeoutId = setTimeout(() => {
      debouncedRefresh();
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      if (refreshTimeoutRef.current) {
        cancelAnimationFrame(refreshTimeoutRef.current);
      }
    };
  }, [debouncedRefresh]);

  const scrollByCards = useCallback((direction) => {
    const el = railRef.current;
    if (!el) return;

    const card = el.querySelector('.portfolio-tiles__card');
    const step = card ? card.getBoundingClientRect().width + 24 : 420;

    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  }, []);

  return (
    <section className="portfolio-tiles" ref={sectionRef} aria-labelledby="portfolioTitle">
      <div className="portfolio-tiles__header">
        <span id="portfolio" className="section-anchor" aria-hidden="true" />
        <ScrollReveal as="h2" className="portfolio-tiles__title" y={25} duration={0.6} start="top 92%">
          Our Portfolio
        </ScrollReveal>
      </div>

      <div className="portfolio-tiles__railWrap">
        <button
          type="button"
          className="portfolio-tiles__paddle portfolio-tiles__paddle--left"
          onClick={() => scrollByCards('left')}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
        />
        <button
          type="button"
          className="portfolio-tiles__paddle portfolio-tiles__paddle--right"
          onClick={() => scrollByCards('right')}
          aria-label="Scroll right"
          disabled={!canScrollRight}
        />

        <div className="portfolio-tiles__rail" ref={railRef}>
          {portfolioItems.map((item, index) => (
            <ScrollReveal
              as="article"
              className="portfolio-tiles__card"
              key={item.title}
              y={30}
              duration={0.6}
              delay={index * 0.08}
              start="top 90%"
            >
              <div className="portfolio-tiles__media" aria-hidden="true">
                <BlurUpImage
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 85vw, 430px"
                  onLoad={handleImageLoad}
                  onError={handleImageLoad}
                />
                <div className="portfolio-tiles__overlay" />
              </div>

              <div className="portfolio-tiles__content">
                <div className="portfolio-tiles__eyebrow">{item.eyebrow}</div>
                <h3 className="portfolio-tiles__cardTitle">{item.title}</h3>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
export { Portfolio };

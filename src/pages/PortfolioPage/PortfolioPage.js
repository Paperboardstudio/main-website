import React, { useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PortfolioPage.scss';

gsap.registerPlugin(ScrollTrigger);

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

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.portfolio-tiles__card');
      if (reduceMotion) return;

      gsap.set(cards, { opacity: 0, y: 18 });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    // Refresh once after section mounts and cards are created
    const timeoutId = setTimeout(() => {
      debouncedRefresh();
    }, 100);

    return () => {
      ctx.revert();
      clearTimeout(timeoutId);
      if (refreshTimeoutRef.current) {
        cancelAnimationFrame(refreshTimeoutRef.current);
      }
    };
  }, [debouncedRefresh]);

  const updatePaddles = () => {
    const el = railRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 4);
  };

  useLayoutEffect(() => {
    updatePaddles();

    const el = railRef.current;
    if (!el) return;

    const onScroll = () => updatePaddles();
    el.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => updatePaddles();
    window.addEventListener('resize', onResize);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollByCards = (direction) => {
    const el = railRef.current;
    if (!el) return;

    const card = el.querySelector('.portfolio-tiles__card');
    const step = card ? card.getBoundingClientRect().width + 24 : 420;

    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <section className="portfolio-tiles" ref={sectionRef} aria-labelledby="portfolioTitle">
      <div className="portfolio-tiles__header">
        <span id="portfolio" className="section-anchor" aria-hidden="true" />
        <h2 className="portfolio-tiles__title">
          Our Portfolio
        </h2>
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
          {portfolioItems.map((item) => (
            <article className="portfolio-tiles__card" key={item.title}>
              <div className="portfolio-tiles__media" aria-hidden="true">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onLoad={handleImageLoad}
                  onError={handleImageLoad}
                />
                <div className="portfolio-tiles__overlay" />
              </div>

              <div className="portfolio-tiles__content">
                <div className="portfolio-tiles__eyebrow">{item.eyebrow}</div>
                <h3 className="portfolio-tiles__cardTitle">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
export { Portfolio };
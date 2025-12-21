import React, { useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicePage.scss';

gsap.registerPlugin(ScrollTrigger);

export const ServiceCard = ({ title, technologies = [], image, imageAlt, index, onImageLoad }) => {
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    if (!cardRef.current) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Always make sure the card is visible by default (prevents "nothing shows" scenarios)
    gsap.set(cardRef.current, { opacity: 1, y: 0 });

    if (reduceMotion) return;

    const card = cardRef.current;
    let hasAnimated = false;

    const ctx = gsap.context(() => {
      // Start hidden ONLY for the animation, but ensure trigger will reliably fire
      gsap.set(card, { opacity: 0, y: 24 });

      const tween = gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => { hasAnimated = true; },
        scrollTrigger: {
          trigger: card,
          start: 'top 95%',
          end: 'bottom 60%',
          once: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    }, card);

    // Safety fallback: if animation hasn't run after 1.5s, force visibility
    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated && card) {
        gsap.set(card, { opacity: 1, y: 0 });
      }
    }, 1500);

    return () => {
      clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, []);

  const handleImageLoad = useCallback(() => {
    if (onImageLoad) {
      onImageLoad();
    }
  }, [onImageLoad]);

  return (
    <article className="service-card" ref={cardRef}>
      <h2 className="service-card__title">{title}</h2>

      <div className="service-card__image">
        <img
          ref={imgRef}
          src={image}
          alt={imageAlt || title}
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding="async"
          sizes="(max-width: 768px) 100vw, 900px"
          onLoad={handleImageLoad}
          onError={(e) => {
            // Optional: add a visible fallback state if the path is wrong at runtime
            e.currentTarget.dataset.broken = 'true';
            handleImageLoad();
          }}
        />
      </div>

      <ul className="service-card__technologies">
        {technologies.map((tech) => (
          <li key={tech} className="service-card__technology">
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
};

export const Services = () => {
  const sectionRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const imageLoadCountRef = useRef(0);
  const totalImagesRef = useRef(0);

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
    if (imageLoadCountRef.current >= totalImagesRef.current) {
      // All images loaded, refresh once
      debouncedRefresh();
    }
  }, [debouncedRefresh]);

  const services = useMemo(
    () => [
      {
        title: 'Mobile app development',
        image: '/images/service1.webp',
        technologies: ['Swift', 'React Native', 'Flutter', 'Kotlin'],
        imageAlt: 'Mobile development concepts',
      },
      {
        title: 'Solid design solutions',
        image: '/images/service2.webp',
        technologies: ['Figma', 'After Effects', 'Illustrator', 'Blender', 'Cinema 4D'],
        imageAlt: 'Design tools and artwork',
      },
      {
        title: 'Web development',
        image: '/images/service3.webp',
        technologies: ['React', 'Vue', 'Node.js', 'Webflow'],
        imageAlt: 'Web development environment',
      },
    ],
    []
  );

  totalImagesRef.current = services.length;

  // Refresh once after section mounts and cards are created
  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      debouncedRefresh();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (refreshTimeoutRef.current) {
        cancelAnimationFrame(refreshTimeoutRef.current);
      }
    };
  }, [debouncedRefresh]);

  return (
    <section className="services" ref={sectionRef}>
      <span id="services" className="section-anchor" aria-hidden="true" />
      <h1 className="services__title">Our Services</h1>

      <div className="services__list">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            index={index}
            title={service.title}
            image={service.image}
            technologies={service.technologies}
            imageAlt={service.imageAlt}
            onImageLoad={handleImageLoad}
          />
        ))}
      </div>
    </section>
  );
};
import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BlurUpImage } from '../../components/BlurUpImage';
import { ScrollReveal } from '../../components/ScrollReveal';
import './ServicePage.scss';

export const ServiceCard = ({ title, technologies = [], image, imageAlt, index, onImageLoad, aspectRatio = 1.78 }) => {
  const handleImageLoad = useCallback(() => {
    if (onImageLoad) {
      onImageLoad();
    }
  }, [onImageLoad]);

  return (
    <ScrollReveal
      as="article"
      className="service-card"
      y={40}
      duration={0.7}
      delay={index * 0.1} // Stagger effect
      start="top 88%"
    >
      <h2 className="service-card__title">{title}</h2>

      <div className="service-card__image">
        <BlurUpImage
          src={image}
          alt={imageAlt || title}
          aspectRatio={aspectRatio}
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          sizes="(max-width: 768px) 100vw, 900px"
          onLoad={handleImageLoad}
          onError={handleImageLoad}
        />
      </div>

      <ul className="service-card__technologies">
        {technologies.map((tech) => (
          <li key={tech} className="service-card__technology">
            {tech}
          </li>
        ))}
      </ul>
    </ScrollReveal>
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
        title: 'Web development',
        image: '/images/service3.webp',
        technologies: ['React', 'Vue', 'Node.js', 'Webflow'],
        imageAlt: 'Web development environment',
      },
      {
        title: 'Solid design solutions',
        image: '/images/service2.webp',
        technologies: ['Figma', 'After Effects', 'Illustrator', 'Blender', 'Cinema 4D'],
        imageAlt: 'Design tools and artwork',
      },
    ],
    []
  );

  totalImagesRef.current = services.length;

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

  return (
    <section className="services" ref={sectionRef}>
      <span id="services" className="section-anchor" aria-hidden="true" />
      <ScrollReveal as="h1" className="services__title" y={25} duration={0.6} start="top 92%">
        Our Services
      </ScrollReveal>

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

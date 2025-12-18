import React, { useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicePage.scss';

gsap.registerPlugin(ScrollTrigger);

export const ServiceCard = ({ title, technologies = [], image, imageAlt, index }) => {
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

    const ctx = gsap.context(() => {
      // Start hidden ONLY for the animation, but ensure trigger will reliably fire
      gsap.set(cardRef.current, { opacity: 0, y: 24 });

      const tween = gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          end: 'bottom 60%',
          once: true,
          invalidateOnRefresh: true,
        },
      });

      // If images load after ScrollTrigger measures positions, refresh again.
      const imgEl = imgRef.current;
      const refresh = () => ScrollTrigger.refresh();

      if (imgEl) {
        // If already loaded, refresh on next frame
        if (imgEl.complete) {
          requestAnimationFrame(refresh);
        } else {
          imgEl.addEventListener('load', refresh, { once: true });
          imgEl.addEventListener('error', refresh, { once: true });
        }
      }

      // Also refresh after the browser finishes layout
      requestAnimationFrame(refresh);

      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <article className="service-card" ref={cardRef}>
      <h2 className="service-card__title">{title}</h2>

      <div className="service-card__image">
        <img
          ref={imgRef}
          src={image}
          alt={imageAlt || title}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          onError={(e) => {
            // Optional: add a visible fallback state if the path is wrong at runtime
            e.currentTarget.dataset.broken = 'true';
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

  return (
    <section className="services">
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
          />
        ))}
      </div>
    </section>
  );
};
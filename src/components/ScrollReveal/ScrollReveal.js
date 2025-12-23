import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal - Lightweight scroll-triggered reveal animation
 *
 * Uses `once: true` triggered animations instead of scrubbed for better performance.
 * Scrubbed animations require constant calculations on every frame.
 */
export const ScrollReveal = ({
  children,
  as: Component = 'div',
  className = '',
  style = {},
  // Animation options
  y = 30,
  x = 0,
  opacity = 0,
  scale = 1,
  rotation = 0,
  duration = 0.8,
  ease = 'power2.out',
  // ScrollTrigger options
  start = 'top 85%',
  delay = 0,
  stagger = 0,
  // Performance options
  disabled = false,
  ...props
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || disabled) return;

    // Check for reduced motion preference
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const element = ref.current;

    if (reduceMotion) {
      gsap.set(element, { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 });
      return;
    }

    // Set initial hidden state
    gsap.set(element, { opacity, y, x, scale, rotation });

    // Create lightweight triggered animation (fires once, no continuous calculation)
    const ctx = gsap.context(() => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: element,
          start,
          once: true, // Fire once only - much lighter than scrub
        },
      });
    }, element);

    return () => ctx.revert();
  }, [y, x, opacity, scale, rotation, duration, ease, start, delay, disabled]);

  return (
    <Component ref={ref} className={className} style={style} {...props}>
      {children}
    </Component>
  );
};

/**
 * Parallax - Lightweight parallax effect
 *
 * Only applies on devices that can handle it (non-touch, no reduced motion)
 */
export const Parallax = ({
  children,
  as: Component = 'div',
  className = '',
  style = {},
  speed = 0.3,
  direction = 'up',
  disabled = false,
  ...props
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || disabled) return;

    // Disable parallax on touch devices and reduced motion
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || isTouchDevice) return;

    const element = ref.current;
    const distance = 40 * speed; // Reduced distance for subtler effect
    const yFrom = direction === 'up' ? distance : -distance;
    const yTo = direction === 'up' ? -distance : distance;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: yFrom },
        {
          y: yTo,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1, // Use 1 (not true) for less frequent updates
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [speed, direction, disabled]);

  return (
    <Component ref={ref} className={className} style={style} {...props}>
      {children}
    </Component>
  );
};

export default ScrollReveal;

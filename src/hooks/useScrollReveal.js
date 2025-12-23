import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal - A hook for scroll-triggered reveal animations
 *
 * @param {Object} options - Configuration options
 * @param {number} options.y - Initial Y offset (default: 40)
 * @param {number} options.opacity - Initial opacity (default: 0)
 * @param {string} options.start - ScrollTrigger start position (default: 'top 85%')
 * @param {string} options.end - ScrollTrigger end position (default: 'top 50%')
 * @param {number|boolean} options.scrub - Scrub value for scroll-locked animation (default: 0.6)
 * @param {boolean} options.once - Only animate once (default: false)
 * @param {boolean} options.disabled - Disable the animation (default: false)
 *
 * @returns {React.RefObject} - Ref to attach to the element
 */
export const useScrollReveal = ({
  y = 40,
  opacity = 0,
  start = 'top 85%',
  end = 'top 50%',
  scrub = 0.6,
  once = false,
  disabled = false,
} = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || disabled) return;

    // Check for reduced motion preference
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }

    const element = ref.current;

    // Set initial hidden state
    gsap.set(element, { opacity, y });

    // Create the reveal animation
    const ctx = gsap.context(() => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        ease: scrub ? 'none' : 'power2.out',
        duration: scrub ? undefined : 0.8,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          once,
          invalidateOnRefresh: true,
        },
      });
    }, element);

    return () => ctx.revert();
  }, [y, opacity, start, end, scrub, once, disabled]);

  return ref;
};

/**
 * useParallax - A hook for parallax scroll effects
 *
 * @param {Object} options - Configuration options
 * @param {number} options.speed - Parallax speed multiplier (default: 0.5)
 * @param {string} options.direction - 'up' or 'down' (default: 'up')
 *
 * @returns {React.RefObject} - Ref to attach to the element
 */
export const useParallax = ({
  speed = 0.5,
  direction = 'up',
} = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) return;

    const element = ref.current;
    const distance = 60 * speed;
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
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [speed, direction]);

  return ref;
};

export default useScrollReveal;

import React, { useState, useRef, useEffect, useMemo } from 'react';
import './BlurUpImage.scss';

// Detect iOS for more conservative loading
const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes('mac') && 'ontouchend' in document);
};

/**
 * BlurUpImage - Progressive image loading with blur-up effect
 *
 * Shows a blurred placeholder that smoothly transitions to the full image
 * when loaded, eliminating the jarring "pop-in" effect.
 */
export const BlurUpImage = ({
  src,
  alt = '',
  sizes,
  aspectRatio,
  fill = false, // When true, fills parent container instead of using aspect-ratio
  className = '',
  onLoad,
  onError,
  loading = 'lazy',
  fetchPriority = 'auto',
  placeholderColor = '#111',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
  const containerRef = useRef(null);
  const isIOS = useMemo(() => isIOSDevice(), []);

  // Lazy loading with IntersectionObserver for better control
  useEffect(() => {
    if (shouldLoad || loading === 'eager') return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: isIOS ? '100px' : '200px',
        threshold: 0
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldLoad, loading, isIOS]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e) => {
    // Still mark as "loaded" to remove loading state
    setIsLoaded(true);
    onError?.(e);
  };

  return (
    <div
      ref={containerRef}
      className={`blur-up-image ${fill ? 'blur-up-image--fill' : ''} ${className} ${isLoaded ? 'blur-up-image--loaded' : ''}`}
      style={{
        '--aspect-ratio': aspectRatio,
        '--placeholder-color': placeholderColor,
      }}
    >
      {/* Placeholder layer - shown until image loads */}
      <div className="blur-up-image__placeholder" aria-hidden="true" />

      {/* Actual image - fades in when loaded */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className="blur-up-image__img"
        />
      )}
    </div>
  );
};

export default BlurUpImage;

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Preload } from '@react-three/drei';
import './TransitionPage.scss';

// Detect iOS devices (iPhone, iPad, iPod)
const useIsIOS = () => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) ||
        (userAgent.includes('mac') && 'ontouchend' in document);
      setIsIOS(isIOSDevice);
    };
    checkIOS();
  }, []);

  return isIOS;
};

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default function TransitionPage() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const isIOS = useIsIOS();
  const isMobile = useIsMobile();
  const isTouchDevice = isMobile || isIOS;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '100px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Show simple fallback on iOS to prevent WebGL memory issues
  if (isIOS) {
    return (
      <div className="transition-page" ref={containerRef}>
        <div
          style={{
            position: 'absolute',
            top: isTouchDevice ? '35%' : 'calc(50% + 40px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            padding: '0 1rem',
            boxSizing: 'border-box',
          }}
        >
          <div className="transition-message">
            We provide entrepreneurs and companies around the world with efficient and innovative tools. Leveraging cutting-edge technology and creativity, we are committed to creating solutions that deliver results for our clients.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-page" ref={containerRef}>
      <Canvas
        gl={{ antialias: false }}
        className="canvas"
        style={{ touchAction: 'pan-y' }}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <Preload />
        <Html
          style={{
            position: 'absolute',
            top: isTouchDevice ? '35%' : 'calc(50% + 40px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <div className="transition-message">
          We provide entrepreneurs and companies around the world with efficient and innovative tools. Leveraging cutting-edge technology and creativity, we are committed to creating solutions that deliver results for our clients.
          </div>
        </Html>
      </Canvas>
    </div>
  );
}
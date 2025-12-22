import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, Preload } from '@react-three/drei';
import './TransitionPage.scss';

// Early iOS detection (synchronous, no useState flicker)
const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes('mac') && 'ontouchend' in document);
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

// Component to handle Three.js cleanup on unmount
const SceneCleanup = () => {
  const { gl } = useThree();

  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl]);

  return null;
};

export default function TransitionPage() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  // Use synchronous check for iOS to prevent canvas mount/unmount flicker
  const [isIOS] = useState(() => isIOSDevice());
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
            top: '35%',
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
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
        }}
        className="canvas"
        style={{ touchAction: 'pan-y' }}
        frameloop={isVisible ? 'always' : 'never'}
        dpr={isTouchDevice ? [1, 1.5] : [1, 2]}
      >
        <SceneCleanup />
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
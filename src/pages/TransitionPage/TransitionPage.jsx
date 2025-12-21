import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Preload } from '@react-three/drei';
import './TransitionPage.scss';

export default function TransitionPage() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <div className="transition-page" ref={containerRef}>
      <Canvas
        gl={{ antialias: false }}
        className="canvas"
        frameloop={isVisible ? 'always' : 'never'}
      >
        <Preload />
        <Html
          style={{
            position: 'absolute',
            top: 'calc(50% + 40px)',
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
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Preload } from '@react-three/drei';
import './TransitionPage.scss';

export default function TransitionPage() {
  return (
    <div className="transition-page">
      <Canvas gl={{ antialias: false }} className="canvas">
        <Preload />
        <Html style={{ width: '100%' }}> {/* Removed center prop */}
          <div className="transition-message">
            We provide entrepreneurs and companies around the world
          </div>
        </Html>
      </Canvas>
    </div>
  );
}
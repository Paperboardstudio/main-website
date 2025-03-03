import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Preload } from '@react-three/drei';
import './TransitionPage.scss';

export default function TransitionPage() {
  return (
    <div className="transition-page">
      <Canvas gl={{ antialias: false }} className="canvas">
        <Preload />
        <Html
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
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
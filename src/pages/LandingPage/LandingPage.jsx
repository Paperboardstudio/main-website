import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Reusable vectors to avoid allocations in useFrame
const _direction = new THREE.Vector3();
const _panelPosition = new THREE.Vector3();
const _pushDirection = new THREE.Vector3();
const _targetPosition = new THREE.Vector3();

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

const GlassPanel = ({ position, rotation }) => {
  const meshRef = useRef();
  const velocity = useRef(new THREE.Vector3());

  const handlePointerMove = (event) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    _direction.set(mouseX, mouseY, 0).normalize();
    _panelPosition.fromArray(position);
    _pushDirection.subVectors(_direction, _panelPosition).normalize();
    velocity.current.add(_pushDirection.multiplyScalar(0.1));
  };

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Apply velocity and decay
    mesh.position.add(velocity.current);
    velocity.current.multiplyScalar(0.9);

    // Magnetically return to the original position
    _targetPosition.fromArray(position);
    mesh.position.lerp(_targetPosition, 0.05);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerMove={handlePointerMove}
    >
      <boxGeometry args={[0.5, 0.5, 0.05]} />
      <meshPhysicalMaterial
        color="white"
        roughness={0}
        transmission={1}
        thickness={0.5}
        ior={1.5}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};

const GlassSphere = ({ isMobile }) => {
  const groupRef = useRef();
  const sphereRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Reduce panels on mobile for better performance (6x6=36 vs 10x10=100)
  const gridSize = isMobile ? 6 : 10;

  const panels = useMemo(() => {
    const result = [];
    const radius = 2;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const theta = (i / (gridSize - 1)) * Math.PI;
        const phi = (j / gridSize) * Math.PI * 2;

        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * Math.sin(phi);

        const normal = new THREE.Vector3(x, y, z).normalize();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);

        result.push(
          <GlassPanel
            position={[x, y, z]}
            rotation={[euler.x, euler.y, euler.z]}
            key={`${i}-${j}`}
          />
        );
      }
    }
    return result;
  }, [gridSize]);

  return (
    <group position={[5.95, 2.575, 0]} scale={[2.65, 2.65, 2.65]} ref={sphereRef}>
      <group ref={groupRef}>
        {panels}
      </group>
    </group>
  );
};

const RotatingPyramid = () => {
  const pyramidRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    pyramidRef.current.position.y = 0.5 + Math.sin(time.current * 0.5) * 0.2; // Calmer up-and-down movement

    if (Math.floor(time.current) % 4 === 0) {
      pyramidRef.current.material.emissiveIntensity = 10; // Radiate glow periodically
    } else {
      pyramidRef.current.material.emissiveIntensity = 6; // Default glow
    }
  });

  return (
    <mesh ref={pyramidRef} position={[5, 0.8, 0]} scale={[2.5, 2.5, 2.5]}>
      <coneGeometry args={[0.5, 1, 4]} />
      <meshStandardMaterial color="hotpink" emissive="pink" toneMapped={false} />
      <pointLight position={[-1, 0.8, 0]} intensity={8} distance={15} decay={2} />
    </mesh>
  );
};

const BackgroundText = ({ text, position, size }) => {
  const finalPosition = [position[0], position[1], position[2]];
  return (
    <Text3D
      position={finalPosition}
      font="/Libre_Bodoni_Medium_Regular.json"
      size={size + 0.15}
      height={0.125}
      curveSegments={12}
      bevelEnabled={false}
    >
      {text}
      <meshStandardMaterial color="white" />
    </Text3D>
  );
};

const LandingCanvas = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

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

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '200vh' }}
      onContextMenu={handleContextMenu}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        style={{ position: 'absolute', zIndex: 1, height: '100vh' }}
        frameloop={isVisible ? 'always' : 'never'}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />
        <color attach="background" args={["black"]} />

        <Environment preset="studio" />
        <BackgroundText text="P A P E R B O A R D" position={[-15.5, 1.15, -10]} size={1} />
        <BackgroundText text="S T U D I O" position={[-12.5, -1.15, -10]} size={1} />
        <GlassSphere isMobile={isMobile} />
        <RotatingPyramid />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} enableDamping={false} />
      </Canvas>
    </div>
  );
};

export default LandingCanvas;

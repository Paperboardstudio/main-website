import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text3D, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Reusable vectors to avoid allocations in useFrame
const _direction = new THREE.Vector3();
const _panelPosition = new THREE.Vector3();
const _pushDirection = new THREE.Vector3();
const _targetPosition = new THREE.Vector3();

// Early iOS detection (synchronous, no useState flicker)
const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes('mac') && 'ontouchend' in document);
};

// Memory cleanup utility for Three.js
const disposeObject = (obj) => {
  if (!obj) return;
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach(m => m.dispose());
    } else {
      obj.material.dispose();
    }
  }
  if (obj.children) {
    obj.children.forEach(child => disposeObject(child));
  }
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
  const lastFrameTime = useRef(0);

  // Frame rate limiting for mobile (target 30fps instead of 60fps)
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isMobile) {
      // Throttle to ~30fps on mobile to reduce GPU load
      lastFrameTime.current += delta;
      if (lastFrameTime.current < 0.033) return;
      lastFrameTime.current = 0;
    }

    groupRef.current.rotation.y += delta * 0.1;
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

  // Adjust position and scale for mobile viewport
  const position = isMobile ? [0, 2.5, 0] : [5.95, 2.575, 0];
  const scale = isMobile ? 1.8 : 2.65;

  return (
    <group position={position} scale={[scale, scale, scale]} ref={sphereRef}>
      <group ref={groupRef}>
        {panels}
      </group>
    </group>
  );
};

const RotatingPyramid = ({ isMobile }) => {
  const pyramidRef = useRef();
  const time = useRef(0);

  // Adjust position and scale for mobile viewport
  const baseY = isMobile ? 1.5 : 0.8;
  const position = isMobile ? [0, baseY, 0] : [5, baseY, 0];
  const scale = isMobile ? 1.8 : 2.5;

  useFrame((state, delta) => {
    time.current += delta;
    pyramidRef.current.position.y = baseY + Math.sin(time.current * 0.5) * 0.2; // Calmer up-and-down movement

    if (Math.floor(time.current) % 4 === 0) {
      pyramidRef.current.material.emissiveIntensity = 10; // Radiate glow periodically
    } else {
      pyramidRef.current.material.emissiveIntensity = 6; // Default glow
    }
  });

  return (
    <mesh ref={pyramidRef} position={position} scale={[scale, scale, scale]}>
      <coneGeometry args={[0.5, 1, 4]} />
      <meshStandardMaterial color="hotpink" emissive="pink" toneMapped={false} />
      <pointLight position={[-1, 0.8, 0]} intensity={8} distance={15} decay={2} />
    </mesh>
  );
};

const BackgroundText = ({ text, position, size, isMobile }) => {
  // On mobile: half size, centered, lower position
  const mobileSize = size * 0.45;
  const finalSize = isMobile ? mobileSize : size;

  // Adjust position for mobile - centered (x near 0) and positioned lower on screen
  const finalPosition = isMobile
    ? [text === 'P A P E R B O A R D' ? -3.6 : -2, text === 'P A P E R B O A R D' ? -6.25 : -7.5, position[2]]
    : [position[0], position[1], position[2]];

  return (
    <Text3D
      position={finalPosition}
      font="/Libre_Bodoni_Medium_Regular.json"
      size={finalSize + 0.15}
      height={0.125}
      curveSegments={12}
      bevelEnabled={false}
    >
      {text}
      <meshStandardMaterial color="white" />
    </Text3D>
  );
};

// Component to handle Three.js cleanup on unmount
const SceneCleanup = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    return () => {
      // Dispose scene objects
      scene.traverse((object) => {
        disposeObject(object);
      });
      // Clear renderer state
      gl.dispose();
    };
  }, [gl, scene]);

  return null;
};

const LandingCanvas = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  // Use synchronous check for iOS to prevent canvas mount/unmount flicker
  const [isIOS] = useState(() => isIOSDevice());

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

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Check if touch device (mobile or iOS)
  const isTouchDevice = isMobile || isIOS;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: isTouchDevice ? '100vh' : '200vh', overflowX: 'hidden' }}
      onContextMenu={handleContextMenu}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        style={{
          position: 'absolute',
          zIndex: 1,
          height: '100vh',
          touchAction: 'pan-y',
          pointerEvents: isTouchDevice ? 'none' : 'auto',
        }}
        frameloop={isVisible ? 'always' : 'never'}
        dpr={isTouchDevice ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: !isTouchDevice,
        }}
      >
        <SceneCleanup />
        <ambientLight intensity={0.5} />
        <color attach="background" args={["black"]} />

        <Environment preset="studio" />
        <BackgroundText text="P A P E R B O A R D" position={[-15.5, 1.15, -10]} size={1} isMobile={isTouchDevice} />
        <BackgroundText text="S T U D I O" position={[-12.5, -1.15, -10]} size={1} isMobile={isTouchDevice} />
        <GlassSphere isMobile={isTouchDevice} />
        <RotatingPyramid isMobile={isTouchDevice} />
        {!isTouchDevice && (
          <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} enableDamping={false} />
        )}
      </Canvas>
    </div>
  );
};

export default LandingCanvas;

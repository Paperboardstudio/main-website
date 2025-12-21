import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Reusable vectors to avoid allocations in useFrame
const _direction = new THREE.Vector3();
const _panelPosition = new THREE.Vector3();
const _pushDirection = new THREE.Vector3();
const _targetPosition = new THREE.Vector3();

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

const GlassSphere = () => {
  const groupRef = useRef();
  const sphereRef = useRef(); // Add a ref for the sphere's position

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.1; // Rotate the group
  });

  const panels = [];
  const radius = 2;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const theta = (i / 9) * Math.PI;
      const phi = (j / 10) * Math.PI * 2;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.cos(theta);
      const z = radius * Math.sin(theta) * Math.sin(phi);

      const normal = new THREE.Vector3(x, y, z).normalize();

      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      const euler = new THREE.Euler().setFromQuaternion(quaternion);

      panels.push(<GlassPanel position={[x, y, z]} rotation={[euler.x, euler.y, euler.z]} key={`${i}-${j}`} />);
    }
  }

  return (
    <group position={[5.95, 2.575, 0]} scale={[2.65, 2.65, 2.65]} ref={sphereRef}> {/* Position the sphere */}
      <group ref={groupRef}> {/* Rotate this group */}
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
      >
        <ambientLight intensity={0.5} />
        {/* Scene background color */}
        <color attach="background" args={["black"]} />

        {/* Keep environment for reflections, but not as background */}
        <Environment preset="studio" />
        <BackgroundText text="P A P E R B O A R D" position={[-15.5, 1.15, -10]} size={1} />
        <BackgroundText text="S T U D I O" position={[-12.5, -1.15, -10]} size={1} />
        <GlassSphere />
        <RotatingPyramid />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} enableDamping={false} />
      </Canvas>
    </div>
  );
};

export default LandingCanvas;

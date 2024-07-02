import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import PropTypes from 'prop-types';

export const GLTFModel = ({ url }) => {
  const group = useRef();
  const { nodes, materials } = useGLTF(url);

  return (
    <Canvas style={{ height: '100%', width: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <group ref={group} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cap.geometry}
          material={materials['Stainless Steel']}
          position={[0, 0.8, -0.61]}
          rotation={[-0.91, 0, 0]}
          scale={[-0.13, 0.03, -0.13]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Jerry_Can.geometry}
          material={materials['Red Gloss Paint']}
          onClick={(e) => console.log('you clicked the model')}
        />
      </group>
      <OrbitControls />
    </Canvas>
  );
};

GLTFModel.propTypes = {
  url: PropTypes.string.isRequired,
};

useGLTF.preload("/kerosene.gltf");

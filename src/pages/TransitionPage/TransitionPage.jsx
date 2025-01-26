import * as THREE from 'three';
import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, ScrollControls, Scroll, useScroll, Image as ImageImpl } from '@react-three/drei';
import './TransitionPage.scss';

const dataSource = {
  images: [
    { position: [-2, 0, 0], scale: [4, "height", 1], url: "https://dummyimage.com/600x400/cccccc/ffffff" },
    { position: [2, 0, 1], scale: 3, url: "https://dummyimage.com/600x400/cccccc/ffffff" },
    { position: [-2.3, "-height", 2], scale: [1, 3, 1], url: "https://dummyimage.com/600x400/cccccc/ffffff" },
    { position: [-0.6, "-height", 3], scale: [1, 2, 1], url: "https://dummyimage.com/600x400/cccccc/ffffff" },
    { position: [0, "-height * 1.5", 2.5], scale: [1.5, 3, 1], url: "https://dummyimage.com/600x400/cccccc/ffffff" },
    { position: [0, "-height * 2 - height / 4", 0], scale: ["width", "height / 2", 1], url: "https://dummyimage.com/600x400/cccccc/ffffff" },
  ],
  textContent: [
    { text: "To Delight", position: { top: "50vh", left: "0.5em" } },
    { text: "Inspire", position: { top: "90vh", left: "60vw" } },
    { text: "Innovate", position: { top: "140vh", left: "0.5vw" } },
  ],
};

function Image({ c = new THREE.Color(), ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  useFrame(() => {
    ref.current.material.color.lerp(c.set(hovered ? 'white' : '#ccc'), hovered ? 0.4 : 0.05);
  });
  return <ImageImpl ref={ref} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} {...props} />;
}

function Images() {
  const { width, height } = useThree((state) => state.viewport);
  const data = useScroll();
  const group = useRef();
  useFrame(() => {
    group.current.children.forEach((child, index) => {
      if (index === 0 || index === 1) {
        child.material.zoom = 1 + data.range(0, 1 / 2) / 3;
      } else {
        child.material.zoom = 1 + data.range(1.15 / 2, 1 / 2) / (index % 2 === 0 ? 3 : 2);
      }
    });
  });
  return (
    <group ref={group}>
      {dataSource.images.map((image, i) => (
        <Image
          key={i}
          position={image.position.map((val) => (typeof val === 'string' ? eval(val) : val))}
          scale={Array.isArray(image.scale) ? image.scale.map((val) => (typeof val === 'string' ? eval(val) : val)) : image.scale}
          url={image.url}
        />
      ))}
    </group>
  );
}

function TextContent() {
  return (
    dataSource.textContent.map((content, i) => (
      <h1
        key={i}
        className="text-content"
        style={{ top: content.position.top, left: content.position.left }}
      >
        {content.text}
      </h1>
    ))
  );
}

export default function TransitionPage() {
  return (
    <div className="transition-page">
      <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} className="canvas">
        <Suspense fallback={null}>
        <ScrollControls
          pages={3}
          damping={0.1}
          style={{
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', // For IE and Edge
          }}
        >            <Scroll>
              <Images />
            </Scroll>
            <Scroll html>
              <TextContent />
            </Scroll>
          </ScrollControls>
          <Preload />
        </Suspense>
      </Canvas>
    </div>
  );
}

// CSS Styles
const styles = `
  .transition-page {
    position: relative;
    width: 100%;
    height: 120vh;
    overflow: hidden !important;
    scrollbar-width: none;
  }

  .transition-page::-webkit-scrollbar {
    display: none;
  }

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  .text-content {
    position: absolute;
    color: black;
    font-size: 3rem;
  }

  .text-content:nth-child(3) {
    font-size: 8rem;
  }
`;

// Inject CSS styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
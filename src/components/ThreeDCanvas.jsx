import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import TestNodes from './TestNodes';

const ThreeDCanvas = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-black">
      <Canvas
        camera={{ position: [0, 50, 100], fov: 45 }}
        style={{ background: 'black' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid size={100} divisions={24} />
        <TestNodes />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
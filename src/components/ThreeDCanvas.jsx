import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import TestNodes from './TestNodes';

const ThreeDCanvas = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-black">
      <Canvas
        camera={{ 
          position: [0, 100, 0],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'black' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid size={100} divisions={24} />
        <TestNodes />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          maxDistance={200}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import TestNodes from './TestNodes';
import Toolbar from './Toolbar';
import ThreeDNode from './ThreeDNode';

const ThreeDCanvas = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState([]);

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.1, Math.min(2, prev + delta)));
  };

  const handleAddNode = () => {
    const newNode = {
      id: Date.now(),
      position: [0, 10, 0], // Start slightly above the grid
      title: 'New Node'
    };
    setNodes(prev => [...prev, newNode]);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black">
      <div className="absolute top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
          onAddNode={handleAddNode}
        />
      </div>
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
        {nodes.map(node => (
          <ThreeDNode 
            key={node.id}
            node={node}
            onUpdate={(newPosition) => {
              setNodes(prev => prev.map(n => 
                n.id === node.id ? { ...n, position: newPosition } : n
              ));
            }}
          />
        ))}
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
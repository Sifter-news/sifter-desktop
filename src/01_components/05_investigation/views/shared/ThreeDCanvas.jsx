import React from 'react';
import { Canvas } from '@react-three/fiber';
import ThreeScene from '@/components/three/ThreeScene';

const ThreeDCanvas = ({ 
  nodes, 
  setNodes, 
  onNodeUpdate, 
  onNodeDelete,
  focusedNodeId,
  onNodeFocus,
  onAddNode 
}) => {
  return (
    <Canvas
      camera={{ 
        position: [0, 0, 1000],
        fov: 45,
        near: 0.1,
        far: 20000
      }}
      style={{ background: 'black' }}
    >
      <ThreeScene 
        nodes={nodes}
        handleNodeUpdate={onNodeUpdate}
        onNodeDelete={onNodeDelete}
        focusedNodeId={focusedNodeId}
        onNodeFocus={onNodeFocus}
        onAddNode={onAddNode}
      />
    </Canvas>
  );
};

export default ThreeDCanvas;
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import Grid from './Grid';
import Toolbar from './Toolbar';
import ThreeDNode from './ThreeDNode';
import ConnectionLine from './ConnectionLine';
import { useNodes } from '../hooks/useNodes';
import { useConnections } from '../hooks/useConnections';
import { useViewControls } from '../hooks/useViewControls';

const ThreeDCanvas = () => {
  const {
    nodes,
    setNodes,
    handleNodeUpdate
  } = useNodes();

  const {
    connections,
    setConnections,
    activeConnection,
    setActiveConnection,
    handleStartConnection,
    handleEndConnection
  } = useConnections();

  const {
    activeTool,
    setActiveTool,
    zoom,
    setZoom,
    viewMode,
    setViewMode,
    controlsRef
  } = useViewControls();

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.1, Math.min(2, prev + delta)));
  };

  const handlePointerMove = (event) => {
    if (activeConnection) {
      const { clientX, clientY } = event;
      setActiveConnection(prev => ({
        ...prev,
        targetPosition: [clientX / 100 - 5, 10, clientY / 100 - 5]
      }));
    }
  };

  return (
    <div 
      className="relative w-full h-[calc(100vh-64px)] bg-black"
      onPointerMove={handlePointerMove}
    >
      <div className="absolute top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
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
            activeTool={activeTool}
            onUpdate={handleNodeUpdate}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
          />
        ))}

        {connections.map(connection => (
          <ConnectionLine
            key={connection.id}
            start={connection.sourcePosition}
            end={connection.targetPosition}
          />
        ))}

        {activeConnection && (
          <ConnectionLine
            start={activeConnection.sourcePosition}
            end={activeConnection.targetPosition}
          />
        )}

        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={activeTool === 'pan'}
          enableRotate={viewMode === '3d' && activeTool === 'pan'}
          maxDistance={200}
          minDistance={10}
          maxPolarAngle={viewMode === '2d' ? 0 : Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
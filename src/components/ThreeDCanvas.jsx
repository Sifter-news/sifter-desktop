import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';
import { useNodes } from '@/hooks/useNodes';
import { useZoomPan } from '@/hooks/useZoomPan';

const ThreeDCanvas = () => {
  const [activeTool, setActiveTool] = React.useState('pan');
  const [viewMode, setViewMode] = React.useState('2d');
  const [showDebug, setShowDebug] = React.useState(false);
  const controlsRef = useRef();
  
  const {
    nodes,
    setNodes,
    updateNodePosition
  } = useNodes([]);

  const {
    zoom,
    handleZoom
  } = useZoomPan(1);

  const handleNodeUpdate = async (nodeId, newPosition) => {
    try {
      await updateNodePosition(nodeId, {
        position_x: newPosition[0],
        position_y: newPosition[1],
        position_z: 0
      });
    } catch (error) {
      console.error('Error updating node position:', error);
      toast.error('Failed to update node position');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black">
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4">
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
          position: [0, 0, 200],
          fov: 45,
          near: 0.1,
          far: 2000
        }}
        style={{ background: 'black' }}
      >
        <ThreeScene 
          nodes={nodes}
          viewMode={viewMode}
          activeTool={activeTool}
          controlsRef={controlsRef}
          handleNodeUpdate={handleNodeUpdate}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
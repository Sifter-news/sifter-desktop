import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';

const CameraDebug = () => {
  const { camera } = useThree();
  
  return (
    <div className="absolute top-0 left-0 bg-black/50 text-white p-2 font-mono text-sm z-20">
      <div>Position: x:{camera.position.x.toFixed(2)} y:{camera.position.y.toFixed(2)} z:{camera.position.z.toFixed(2)}</div>
      <div>Rotation: x:{camera.rotation.x.toFixed(2)} y:{camera.rotation.y.toFixed(2)} z:{camera.rotation.z.toFixed(2)}</div>
    </div>
  );
};

const ThreeDCanvas = () => {
  const [activeTool, setActiveTool] = useState('pan');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [viewMode, setViewMode] = useState('2d');
  const controlsRef = useRef();

  // Calculate camera position based on view mode
  const cameraPosition = viewMode === '3d' 
    ? [70.71, 70.71, 70.71] // Isometric position (approximately 45° angles)
    : [0, 0, 148]; // Looking down the Z axis from 148 units high

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('node')
          .select('*');
          
        if (error) throw error;
        
        if (data) {
          const mappedNodes = data.map(node => ({
            id: node.id,
            title: node.title || '',
            description: node.description || '',
            position: [
              node.position_x || 0,
              0,
              node.position_y || 0
            ],
            type: node.type || 'generic',
            visualStyle: node.visual_style || 'default'
          }));
          setNodes(mappedNodes);
        }
      } catch (error) {
        console.error('Error loading nodes:', error);
        toast.error('Failed to load nodes');
      }
    };

    fetchNodes();
  }, []);

  const handleNodeUpdate = async (nodeId, newPosition) => {
    try {
      const { error } = await supabase
        .from('node')
        .update({
          position_x: newPosition[0],
          position_y: newPosition[2]
        })
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prev => prev.map(node =>
        node.id === nodeId ? { ...node, position: newPosition } : node
      ));
    } catch (error) {
      console.error('Error updating node position:', error);
      toast.error('Failed to update node position');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black">
      <div className="absolute top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={setZoom}
          zoom={zoom}
          nodes={nodes}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
      <Canvas
        camera={{ 
          position: cameraPosition,
          fov: 45,
          near: 0.1,
          far: 2000,
          up: [0, 1, 0] // Updated to maintain correct orientation in 2D view
        }}
        style={{ background: 'black' }}
      >
        <CameraDebug />
        <ThreeScene 
          nodes={nodes}
          connections={connections}
          activeConnection={activeConnection}
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
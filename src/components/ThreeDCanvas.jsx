import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { toast } from 'sonner';
import ThreeScene from './three/ThreeScene';
import Toolbar from './Toolbar';
import { useDebug } from '@/contexts/DebugContext';
import { supabase } from '@/integrations/supabase/supabase';

const ThreeDCanvas = ({ projectId, onAddNode, onNodeUpdate }) => {
  const [nodes, setNodes] = useState([]);
  const [activeTool, setActiveTool] = useState('pan');
  const [viewMode, setViewMode] = useState('2d');
  const controlsRef = useRef();
  const { setDebugData } = useDebug();

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('node')
          .select('*')
          .eq('investigation_id', projectId);

        if (error) throw error;

        const nodesWithPositions = data.map(node => ({
          ...node,
          position: [
            node.position_x || 0,
            node.position_y || 0,
            node.position_z || 0
          ]
        }));

        setNodes(nodesWithPositions);
      } catch (error) {
        console.error('Error fetching nodes:', error);
        toast.error('Failed to load nodes');
      }
    };

    if (projectId) {
      fetchNodes();
    }
  }, [projectId]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setDebugData(prev => ({
      ...prev,
      viewMode: mode
    }));
  };

  // Camera settings for different view modes
  const cameraSettings = viewMode === '3d' 
    ? {
        position: [100, 100, 100], // Isometric position
        rotation: [-Math.PI / 6, Math.PI / 4, 0], // Isometric rotation
        fov: 50,
        near: 0.1,
        far: 5000
      }
    : {
        position: [0, 0, 200],
        rotation: [0, 0, 0],
        fov: 50,
        near: 0.1,
        far: 5000
      };

  return (
    <div className="fixed inset-0 bg-black">
      <nav className="fixed top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onAddNode={onAddNode}
        />
      </nav>

      <Canvas camera={cameraSettings}>
        <ThreeScene 
          nodes={nodes}
          viewMode={viewMode}
          activeTool={activeTool}
          controlsRef={controlsRef}
          handleNodeUpdate={onNodeUpdate}
        />
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={viewMode === '3d'}
          maxDistance={5000}
          minDistance={1}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { toast } from 'sonner';
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';
import { useNodes } from '@/hooks/useNodes';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useDebug } from '@/contexts/DebugContext';
import { calculateCameraPosition } from '@/utils/threeDUtils';
import { supabase } from '@/integrations/supabase/supabase';

const ThreeDCanvas = ({ projectId, onAddNode, onNodeUpdate }) => {
  const [nodes, setNodes] = useState([]);
  const [activeTool, setActiveTool] = useState('pan');
  const [viewMode, setViewMode] = useState('2d');
  const controlsRef = useRef();
  const { setDebugData } = useDebug();
  const { zoom, handleZoom } = useZoomPan(1);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('node')
          .select('*')
          .eq('investigation_id', projectId);
          
        if (error) throw error;
        
        const nodesWithPositions = data?.map(node => ({
          ...node,
          position: [
            node.position_x || Math.random() * 100 - 50,
            node.position_y || Math.random() * 100 - 50,
            node.position_z || 0
          ]
        })) || [];

        setNodes(nodesWithPositions);
        setDebugData(prev => ({
          ...prev,
          nodes: {
            count: nodesWithPositions.length,
            list: nodesWithPositions
          }
        }));
      } catch (error) {
        console.error('Error fetching nodes:', error);
        toast.error('Failed to load nodes');
      }
    };

    if (projectId) {
      fetchNodes();
    }
  }, [projectId, setDebugData]);

  const cameraPosition = calculateCameraPosition(viewMode, zoom);

  return (
    <div className="fixed inset-0 bg-black">
      <nav className="fixed top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddNode={onAddNode}
        />
      </nav>

      <Canvas
        camera={{ 
          position: cameraPosition,
          fov: 45,
          near: 0.1,
          far: 2000
        }}
        style={{ background: 'black' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <ThreeScene 
          nodes={nodes}
          viewMode={viewMode}
          activeTool={activeTool}
          controlsRef={controlsRef}
          handleNodeUpdate={onNodeUpdate}
          zoom={zoom}
        />
        
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={activeTool === 'pan'}
          enableRotate={activeTool === 'pan'}
          maxDistance={200}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
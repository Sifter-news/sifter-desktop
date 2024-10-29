import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { toast } from 'sonner';
import ThreeScene from './three/ThreeScene';
import Toolbar from './Toolbar';
import { useDebug } from '@/contexts/DebugContext';
import { supabase } from '@/integrations/supabase/supabase';
import { getNodeDimensions } from '@/utils/nodeStyles';

const ThreeDCanvas = ({ 
  projectId, 
  onAddNode, 
  onNodeUpdate,
  focusedNodeId,
  onNodeFocus 
}) => {
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

        // Transform nodes and position them sequentially on X axis
        const nodesWithPositions = data.map((node, index) => {
          const dimensions = getNodeDimensions(node.visual_style || 'default');
          const spacing = Math.max(dimensions.width, 8); // Minimum spacing of 8 units
          
          return {
            ...node,
            position: [index * spacing, 0, 0], // Sequential X positioning
            dimensions: {
              width: dimensions.width / 20, // Scale down for 3D space
              height: dimensions.height / 20,
              depth: 0.1
            },
            visualStyle: node.visual_style || 'default',
            title: node.title || 'Untitled Node',
            avatar: node.avatar || '/default-image.png'
          };
        });

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

  return (
    <div className="fixed inset-0 bg-black">
      <nav className="fixed top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddNode={onAddNode}
        />
      </nav>

      <Canvas
        camera={{
          position: [50, 50, 50],
          fov: 50,
          near: 0.1,
          far: 5000
        }}
      >
        <ThreeScene 
          nodes={nodes}
          viewMode={viewMode}
          activeTool={activeTool}
          controlsRef={controlsRef}
          handleNodeUpdate={onNodeUpdate}
          focusedNodeId={focusedNodeId}
          onNodeFocus={onNodeFocus}
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
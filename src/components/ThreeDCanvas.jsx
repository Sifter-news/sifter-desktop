import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { toast } from 'sonner';
import ThreeScene from './three/ThreeScene';
import Toolbar from './Toolbar';
import { useDebug } from '@/contexts/DebugContext';
import { supabase } from '@/integrations/supabase/supabase';
import { getNodeDimensions } from '@/utils/nodeUtils';

const EXAMPLE_NODES = [
  {
    id: 'example-1',
    title: 'Center Node',
    description: 'Located at (0,0,0)',
    visual_style: 'default',
    node_type: 'node_person',
    avatar: '/default-image.png',
    position: [0, 0, 0]
  },
  {
    id: 'example-2',
    title: 'Compact Node',
    description: 'Located at (0,0,0)',
    visual_style: 'compact',
    node_type: 'node_organization',
    avatar: '/default-image.png',
    position: [0, 0, 0]
  },
  {
    id: 'example-3',
    title: 'Post-it Node',
    description: 'Located at (0,0,0)',
    visual_style: 'postit',
    node_type: 'node_concept',
    avatar: '/default-image.png',
    position: [0, 0, 0]
  }
];

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

        // If no nodes found, use example nodes
        const sourceNodes = data.length > 0 ? data : EXAMPLE_NODES;

        // Transform nodes and position them
        const nodesWithPositions = sourceNodes.map((node) => {
          const dimensions = getNodeDimensions(node.visual_style || 'default');
          
          return {
            ...node,
            position: node.position || [0, 0, 0],
            dimensions: {
              width: dimensions.width / 20,
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
          setViewMode={setViewMode}
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

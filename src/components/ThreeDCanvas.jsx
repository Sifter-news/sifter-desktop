import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { toast } from 'sonner';
import ThreeScene from './three/ThreeScene';
import Toolbar from './Toolbar';
import { useDebug } from '@/contexts/DebugContext';
import { supabase } from '@/integrations/supabase/supabase';
import { getNodeDimensions } from '@/utils/nodeStyles';

const SAMPLE_NODES = [
  {
    id: 'sample-1',
    title: 'Person Node',
    description: 'A sample person node',
    visual_style: 'default',
    node_type: 'node_person',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-2',
    title: 'Compact Organization',
    description: 'A compact organization node',
    visual_style: 'compact',
    node_type: 'node_organization',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-3',
    title: 'Post-it Concept',
    description: 'A post-it style concept node',
    visual_style: 'postit',
    node_type: 'node_concept',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-4',
    title: 'Default Object',
    description: 'A default style object node',
    visual_style: 'default',
    node_type: 'node_object',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-5',
    title: 'Compact Location',
    description: 'A compact location node',
    visual_style: 'compact',
    node_type: 'node_location',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-6',
    title: 'Post-it Event',
    description: 'A post-it style event node',
    visual_style: 'postit',
    node_type: 'node_event',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-7',
    title: 'Default Person',
    description: 'Another person node',
    visual_style: 'default',
    node_type: 'node_person',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-8',
    title: 'Compact Concept',
    description: 'A compact concept node',
    visual_style: 'compact',
    node_type: 'node_concept',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-9',
    title: 'Post-it Organization',
    description: 'A post-it style organization',
    visual_style: 'postit',
    node_type: 'node_organization',
    avatar: '/default-image.png'
  },
  {
    id: 'sample-10',
    title: 'Default Event',
    description: 'A default style event node',
    visual_style: 'default',
    node_type: 'node_event',
    avatar: '/default-image.png'
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

        // If no nodes found, use sample nodes
        const sourceNodes = data.length > 0 ? data : SAMPLE_NODES;

        // Transform nodes and position them sequentially on X axis
        const nodesWithPositions = sourceNodes.map((node, index) => {
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
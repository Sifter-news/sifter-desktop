import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { toast } from 'sonner';
import { Bug } from "lucide-react";
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useDebug } from '@/contexts/DebugContext';
import { supabase } from '@/integrations/supabase/supabase';
import { handleNodeDelete } from '@/utils/nodeOperations';

const ThreeDCanvas = ({ projectId, onAddNode }) => {
  const [nodes, setNodes] = useState([]);
  const [activeTool, setActiveTool] = useState('select');
  const [viewMode, setViewMode] = useState('2d');
  const { zoom, handleZoom } = useZoomPan();
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
        
        const nodesWithPositions = (data || []).map(node => ({
          ...node,
          position: [
            node.position_x || Math.random() * 100 - 50,
            node.position_y || Math.random() * 100 - 50,
            node.position_z || 0
          ]
        }));

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
        toast.error('Failed to fetch nodes');
      }
    };

    if (projectId) {
      fetchNodes();
    }
  }, [projectId]);

  const handleNodeUpdate = async (nodeId, updates) => {
    try {
      const { error } = await supabase
        .from('node')
        .update(updates)
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prev => prev.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ));

      toast.success('Node updated successfully');
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error('Failed to update node');
    }
  };

  const handleAddNode = async (nodeData) => {
    try {
      const { data, error } = await supabase
        .from('node')
        .insert([{
          ...nodeData,
          investigation_id: projectId
        }])
        .select()
        .single();

      if (error) throw error;

      const newNode = {
        ...data,
        position: [data.position_x || 0, data.position_y || 0, data.position_z || 0]
      };

      setNodes(prev => [...prev, newNode]);
      toast.success('Node added successfully');
    } catch (error) {
      console.error('Error adding node:', error);
      toast.error('Failed to add node');
    }
  };

  const handleDeleteNode = async (nodeId) => {
    await handleNodeDelete(nodeId, setNodes);
  };

  return (
    <div className="w-full h-full relative">
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        handleZoom={handleZoom}
        zoom={zoom}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddNode={handleAddNode}
      />

      <Canvas
        camera={{ 
          position: viewMode === '3d' ? [100, 100, 100] : [0, 0, 200],
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
          onNodeDelete={handleDeleteNode}
          handleNodeUpdate={handleNodeUpdate}
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
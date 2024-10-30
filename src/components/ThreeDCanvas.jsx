import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { toast } from 'sonner';
import { Bug } from "lucide-react";
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';
import { useNodes } from '@/hooks/useNodes';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useDebug } from '@/contexts/DebugContext';
import { supabase } from '@/integrations/supabase/supabase';
import { createDebugNodes } from './three/DebugNodes';

const ThreeDCanvas = ({ projectId, onAddNode, onNodeUpdate }) => {
  const [nodes, setNodes] = useState([]);
  const [activeTool, setActiveTool] = React.useState('pan');
  const [viewMode, setViewMode] = React.useState('2d');
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
        
        const debugNodes = createDebugNodes();
        const nodesWithDebug = [...(data || []), ...debugNodes].map(node => ({
          ...node,
          position: node.position || [
            node.position_x || Math.random() * 100 - 50,
            node.position_y || Math.random() * 100 - 50,
            node.position_z || 0
          ]
        }));

        setNodes(nodesWithDebug);
        setDebugData(prev => ({
          ...prev,
          nodes: {
            count: nodesWithDebug.length,
            list: nodesWithDebug
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

  useEffect(() => {
    setDebugData(prev => ({
      ...prev,
      activeTool,
      currentView: 'mindmap',
      viewMode: viewMode
    }));
  }, [activeTool, viewMode, setDebugData]);

  const handleAddNode = async (nodeData) => {
    try {
      const { data, error } = await supabase
        .from('node')
        .insert([{
          ...nodeData,
          investigation_id: projectId,
          position_x: nodeData.position_x,
          position_y: nodeData.position_y,
          position_z: nodeData.position_z || 0
        }])
        .select()
        .single();

      if (error) throw error;

      const newNode = {
        ...data,
        position: [
          data.position_x,
          data.position_y,
          data.position_z || 0
        ]
      };

      setNodes(prev => [...prev, newNode]);
      setDebugData(prev => ({
        ...prev,
        nodes: {
          count: nodes.length + 1,
          list: [...nodes, newNode]
        }
      }));

      toast.success('Node added successfully');
    } catch (error) {
      console.error('Error adding node:', error);
      toast.error('Failed to add node');
    }
  };

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
          position: [0, 0, 200 / zoom],
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
          handleNodeUpdate={onNodeUpdate}
          zoom={zoom}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;

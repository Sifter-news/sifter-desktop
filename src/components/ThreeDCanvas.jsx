import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import Toolbar from './Toolbar';
import ThreeDScene from './three/ThreeDScene';

const ThreeDCanvas = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [viewMode, setViewMode] = useState('2d');

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

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.1, Math.min(2, prev + delta)));
  };

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

  const handleStartConnection = (sourceId, sourcePosition) => {
    setActiveConnection({
      sourceId,
      sourcePosition,
      targetPosition: sourcePosition
    });
  };

  const handleEndConnection = (targetId) => {
    if (activeConnection && activeConnection.sourceId !== targetId) {
      const sourceNode = nodes.find(n => n.id === activeConnection.sourceId);
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (sourceNode && targetNode) {
        setConnections(prev => [...prev, {
          id: Date.now(),
          sourceId: activeConnection.sourceId,
          targetId: targetId,
          sourcePosition: sourceNode.position,
          targetPosition: targetNode.position
        }]);
      }
    }
    setActiveConnection(null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black">
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
          position: [0, 50, 50],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'black' }}
      >
        <ThreeDScene 
          nodes={nodes}
          connections={connections}
          activeConnection={activeConnection}
          activeTool={activeTool}
          viewMode={viewMode}
          handleNodeUpdate={handleNodeUpdate}
          handleStartConnection={handleStartConnection}
          handleEndConnection={handleEndConnection}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
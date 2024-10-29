import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';

const ThreeDCanvas = () => {
  const [activeTool, setActiveTool] = useState('pan');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [viewMode, setViewMode] = useState('2d');
  const [showDebug, setShowDebug] = useState(false);
  const controlsRef = useRef();

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const { data: nodesData, error: nodesError } = await supabase
          .from('node')
          .select('*');
          
        if (nodesError) throw nodesError;
        
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('connections')
          .select('*');

        if (connectionsError) throw connectionsError;
        
        setNodes(nodesData.map(node => ({
          id: node.id,
          title: node.title || '',
          description: node.description || '',
          position: [
            node.position_x || 0,
            node.position_y || 0,
            0
          ],
          type: node.type || 'generic',
          visualStyle: node.visual_style || 'default'
        })));

        setConnections(connectionsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };

    fetchNodes();
  }, []);

  const handleStartConnection = (sourceId, position, connectionPoint) => {
    setActiveConnection({
      sourceId,
      sourcePosition: position,
      sourcePoint: connectionPoint,
      targetPosition: position
    });
  };

  const handleEndConnection = async (targetId, targetPoint) => {
    if (!activeConnection || targetId === activeConnection.sourceId) {
      setActiveConnection(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          source_id: activeConnection.sourceId,
          target_id: targetId,
          source_point: activeConnection.sourcePoint,
          target_point: targetPoint
        });

      if (error) throw error;

      setConnections(prev => [...prev, {
        source_id: activeConnection.sourceId,
        target_id: targetId,
        source_point: activeConnection.sourcePoint,
        target_point: targetPoint
      }]);

      toast.success('Connection created');
    } catch (error) {
      console.error('Error creating connection:', error);
      toast.error('Failed to create connection');
    }

    setActiveConnection(null);
  };

  const handleNodeUpdate = async (nodeId, newPosition) => {
    try {
      const { error } = await supabase
        .from('node')
        .update({
          position_x: newPosition[0],
          position_y: newPosition[1],
          position_z: 0
        })
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prev => prev.map(node =>
        node.id === nodeId ? { ...node, position: [newPosition[0], newPosition[1], 0] } : node
      ));
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
          handleZoom={setZoom}
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
          connections={connections}
          activeConnection={activeConnection}
          viewMode={viewMode}
          activeTool={activeTool}
          controlsRef={controlsRef}
          handleNodeUpdate={handleNodeUpdate}
          onStartConnection={handleStartConnection}
          onEndConnection={handleEndConnection}
          setActiveConnection={setActiveConnection}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
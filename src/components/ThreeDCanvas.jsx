import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { toast } from 'sonner';
import { Bug } from "lucide-react";
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';
import { useNodes } from '@/hooks/useNodes';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useDebug } from '@/contexts/DebugContext';
import { supabase } from '@/integrations/supabase/supabase';

const CameraDebug = () => {
  const { camera, mouse } = useThree();
  const { setDebugData } = useDebug();

  useEffect(() => {
    const updateDebug = () => {
      setDebugData(prev => ({
        ...prev,
        camera: {
          position: {
            x: camera.position.x.toFixed(2),
            y: camera.position.y.toFixed(2),
            z: camera.position.z.toFixed(2)
          },
          rotation: {
            x: camera.rotation.x.toFixed(2),
            y: camera.rotation.y.toFixed(2),
            z: camera.rotation.z.toFixed(2)
          }
        },
        mouse: {
          x: mouse.x.toFixed(2),
          y: mouse.y.toFixed(2),
          z: camera.position.z.toFixed(2)
        }
      }));
    };

    const interval = setInterval(updateDebug, 100);
    return () => clearInterval(interval);
  }, [camera, mouse, setDebugData]);

  return null;
};

const ThreeDCanvas = ({ projectId, onAddNode, onNodeUpdate }) => {
  const [nodes, setNodes] = useState([]);
  const [activeTool, setActiveTool] = React.useState('pan');
  const [viewMode, setViewMode] = React.useState('2d');
  const [showDebug, setShowDebug] = React.useState(false);
  const controlsRef = useRef();
  const { setDebugData } = useDebug();

  const {
    zoom,
    handleZoom
  } = useZoomPan(1);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('node')
          .select('*')
          .eq('investigation_id', projectId);

        if (error) throw error;

        const nodesWithRandomPositions = data.map(node => ({
          ...node,
          position: [
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            0
          ]
        }));

        setNodes(nodesWithRandomPositions);
        setDebugData(prev => ({
          ...prev,
          nodes: {
            count: nodesWithRandomPositions.length,
            list: nodesWithRandomPositions
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

  const handleNodeUpdate = async (nodeId, newPosition) => {
    try {
      if (onNodeUpdate) {
        await onNodeUpdate(nodeId, {
          position_x: newPosition[0],
          position_y: newPosition[1],
          position_z: 0
        });
      }
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
          handleZoom={handleZoom}
          zoom={zoom}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddNode={onAddNode}
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
        <CameraDebug />
        <ThreeScene 
          nodes={nodes}
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

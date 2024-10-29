import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';

const CameraDebugInfo = () => {
  const { camera } = useThree();
  const [cameraState, setCameraState] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  });

  useEffect(() => {
    const updateCameraState = () => {
      setCameraState({
        position: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        },
        rotation: {
          x: camera.rotation.x,
          y: camera.rotation.y,
          z: camera.rotation.z
        }
      });
    };

    updateCameraState();
    camera.addEventListener('change', updateCameraState);
    return () => camera.removeEventListener('change', updateCameraState);
  }, [camera]);

  return null;
};

const ThreeDCanvas = () => {
  const [activeTool, setActiveTool] = useState('pan');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [viewMode, setViewMode] = useState('2d');
  const [cameraDebug, setCameraDebug] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  });
  const controlsRef = useRef();

  // Calculate camera position based on view mode
  const cameraPosition = viewMode === '3d' 
    ? [70.71, 70.71, 70.71] // Isometric position
    : [0, 0, 200]; // 2D front view position

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

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black">
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={setZoom}
          zoom={zoom}
          nodes={nodes}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="bg-black/50 text-white p-2 font-mono text-xs rounded-bl-lg">
          <div>Pos: x:{cameraDebug.position.x.toFixed(2)} y:{cameraDebug.position.y.toFixed(2)} z:{cameraDebug.position.z.toFixed(2)}</div>
          <div>Rot: x:{cameraDebug.rotation.x.toFixed(2)} y:{cameraDebug.rotation.y.toFixed(2)} z:{cameraDebug.rotation.z.toFixed(2)}</div>
        </div>
      </div>
      <Canvas
        camera={{ 
          position: cameraPosition,
          rotation: [0, 0, 0],
          fov: 45,
          near: 0.1,
          far: 2000,
          up: [0, 1, 0]
        }}
        style={{ background: 'black' }}
        onCreated={({ camera }) => {
          setCameraDebug({
            position: {
              x: camera.position.x,
              y: camera.position.y,
              z: camera.position.z
            },
            rotation: {
              x: camera.rotation.x,
              y: camera.rotation.y,
              z: camera.rotation.z
            }
          });
        }}
      >
        <CameraDebugInfo />
        <ThreeScene 
          nodes={nodes}
          connections={connections}
          activeConnection={activeConnection}
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
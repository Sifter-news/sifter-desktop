import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import Toolbar from './Toolbar';
import ThreeDNode from './ThreeDNode';
import ConnectionLine from './ConnectionLine';

const ThreeDCanvas = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [viewMode, setViewMode] = useState('3d');
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      if (viewMode === '2d') {
        // Lock to top-down view
        controlsRef.current.setAzimuthalAngle(0);
        controlsRef.current.setPolarAngle(0);
        controlsRef.current.enableRotate = false;
      } else {
        // Set to isometric view
        controlsRef.current.setAzimuthalAngle(Math.PI / 4);
        controlsRef.current.setPolarAngle(Math.PI / 4);
        controlsRef.current.enableRotate = true;
      }
    }
  }, [viewMode]);

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.1, Math.min(2, prev + delta)));
  };

  const handleAddNode = () => {
    const newNode = {
      id: Date.now(),
      position: [0, 10, 0],
      title: 'New Node'
    };
    setNodes(prev => [...prev, newNode]);
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

  const handlePointerMove = (event) => {
    if (activeConnection) {
      const { clientX, clientY } = event;
      setActiveConnection(prev => ({
        ...prev,
        targetPosition: [clientX / 100 - 5, 10, clientY / 100 - 5]
      }));
    }
  };

  return (
    <div 
      className="relative w-full h-[calc(100vh-64px)] bg-black"
      onPointerMove={handlePointerMove}
    >
      <div className="absolute top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
          onAddNode={handleAddNode}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
      <Canvas
        camera={{ 
          position: viewMode === '2d' ? [0, 100, 0] : [50, 50, 50],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'black' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid size={100} divisions={24} />
        
        {nodes.map(node => (
          <ThreeDNode 
            key={node.id}
            node={node}
            activeTool={activeTool}
            onUpdate={(newPosition) => {
              setNodes(prev => prev.map(n => 
                n.id === node.id ? { ...n, position: newPosition } : n
              ));
              setConnections(prev => prev.map(conn => {
                if (conn.sourceId === node.id) {
                  return { ...conn, sourcePosition: newPosition };
                }
                if (conn.targetId === node.id) {
                  return { ...conn, targetPosition: newPosition };
                }
                return conn;
              }));
            }}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
          />
        ))}

        {connections.map(connection => (
          <ConnectionLine
            key={connection.id}
            start={connection.sourcePosition}
            end={connection.targetPosition}
          />
        ))}

        {activeConnection && (
          <ConnectionLine
            start={activeConnection.sourcePosition}
            end={activeConnection.targetPosition}
          />
        )}

        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={activeTool === 'pan'}
          enableRotate={viewMode === '3d' && activeTool === 'pan'}
          maxDistance={200}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;

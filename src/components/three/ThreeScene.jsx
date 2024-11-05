import React, { useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import Grid from '../Grid';
import Canvas3DCompactNode from '../nodes/Canvas3DCompactNode';
import Canvas3DDefaultNode from '../nodes/Canvas3DDefaultNode';
import Canvas3DPostitNode from '../nodes/Canvas3DPostitNode';
import ConnectionLine from '../ConnectionLine';
import DebugAxes from './DebugAxes';
import { useDebug } from '@/contexts/DebugContext';

const ThreeScene = ({ 
  nodes = [], 
  connections = [],
  activeConnection = null,
  viewMode, 
  activeTool, 
  controlsRef, 
  handleNodeUpdate,
  onStartConnection = () => {},
  onEndConnection = () => {},
  setActiveConnection = () => {},
  zoom = 1
}) => {
  const { camera } = useThree();
  const { showGuides, setDebugData } = useDebug();
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  useEffect(() => {
    setDebugData(prev => ({
      ...prev,
      canvas: {
        ...prev?.canvas,
        selectedNodeId,
        hoveredNodeId
      }
    }));
  }, [selectedNodeId, hoveredNodeId, setDebugData]);

  useEffect(() => {
    if (camera) {
      const distance = viewMode === '3d' ? 20000 / zoom : 2000 / zoom;
      const position = viewMode === '3d' 
        ? [distance, distance, distance] 
        : [0, 0, distance];
      
      camera.position.set(...position);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [viewMode, zoom, camera]);

  const handlePointerMove = (event) => {
    if (activeConnection) {
      event.stopPropagation();
      const { point } = event;
      setActiveConnection(prev => ({
        ...prev,
        targetPosition: [point.x, point.y, point.z]
      }));
    }
  };

  const renderNode = (node) => {
    const position = [node.position_x || 0, node.position_y || 0, node.position_z || 0];
    const props = {
      node,
      activeTool,
      onSelect: () => setSelectedNodeId(node.id),
      isHighlighted: selectedNodeId === node.id || hoveredNodeId === node.id,
      position
    };

    switch (node.visualStyle) {
      case 'compact':
        return <Canvas3DCompactNode key={node.id} {...props} />;
      case 'postit':
        return <Canvas3DPostitNode key={node.id} {...props} />;
      default:
        return <Canvas3DDefaultNode key={node.id} {...props} />;
    }
  };

  return (
    <group onPointerMove={handlePointerMove}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Grid size={100} divisions={24} />
      {showGuides && <DebugAxes />}
      
      {nodes.map(renderNode)}

      {connections.map((connection, index) => (
        <ConnectionLine
          key={`connection-${index}`}
          start={connection.startPosition}
          end={connection.endPosition}
          color={connection.color || 'white'}
        />
      ))}

      {activeConnection && (
        <ConnectionLine
          start={activeConnection.startPosition}
          end={activeConnection.targetPosition}
          color="blue"
          isDashed
        />
      )}

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={activeTool === 'pan'}
        enableRotate={activeTool === 'pan'}
        maxDistance={2000}
        minDistance={10}
        zoomSpeed={0.5}
        screenSpacePanning={true}
      />
    </group>
  );
};

export default ThreeScene;
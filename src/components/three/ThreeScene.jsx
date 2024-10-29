import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import Grid from '../Grid';
import ThreeDNode from '../ThreeDNode';
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
  focusedNodeId,
  onNodeFocus,
  onStartConnection = () => {},
  onEndConnection = () => {},
  setActiveConnection = () => {}
}) => {
  const { camera } = useThree();
  const { showGuides } = useDebug();

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

  return (
    <group onPointerMove={handlePointerMove}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid size={1000} divisions={100} />
      {showGuides && <DebugAxes />}
      
      {nodes?.map(node => (
        <ThreeDNode 
          key={node.id}
          node={node}
          activeTool={activeTool}
          onUpdate={handleNodeUpdate}
          onStartConnection={onStartConnection}
          onEndConnection={onEndConnection}
          viewMode={viewMode}
          isHighlighted={focusedNodeId === node.id}
          onFocus={onNodeFocus}
        />
      ))}

      {connections?.map((connection, index) => (
        <ConnectionLine
          key={index}
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
    </group>
  );
};

export default ThreeScene;
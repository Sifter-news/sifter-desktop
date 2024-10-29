import React from 'react';
import { OrbitControls } from '@react-three/drei';
import Grid from '../Grid';
import ThreeDNode from '../ThreeDNode';
import ConnectionLine from '../ConnectionLine';
import DebugAxes from './DebugAxes';

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
  setActiveConnection = () => {}
}) => {
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
      <Grid size={100} divisions={24} />
      <DebugAxes />
      
      {nodes?.map(node => (
        <ThreeDNode 
          key={node.id}
          node={node}
          activeTool={activeTool}
          onUpdate={handleNodeUpdate}
          onStartConnection={onStartConnection}
          onEndConnection={onEndConnection}
        />
      ))}

      {connections?.map((connection, index) => {
        const sourceNode = nodes?.find(n => n.id === connection.source_id);
        const targetNode = nodes?.find(n => n.id === connection.target_id);
        
        if (!sourceNode || !targetNode) return null;

        const sourceY = connection.source_point === 'top' ? 2.5 : -2.5;
        const targetY = connection.target_point === 'top' ? 2.5 : -2.5;

        return (
          <ConnectionLine
            key={index}
            start={[sourceNode.position[0], sourceNode.position[1] + sourceY, 0]}
            end={[targetNode.position[0], targetNode.position[1] + targetY, 0]}
          />
        );
      })}

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
        enableRotate={activeTool === 'pan'}
        maxDistance={200}
        minDistance={10}
      />
    </group>
  );
};

export default ThreeScene;
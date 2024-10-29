import React from 'react';
import { OrbitControls } from '@react-three/drei';
import Grid from '../Grid';
import ThreeDNode from '../ThreeDNode';
import ConnectionLine from '../ConnectionLine';
import DebugAxes from './DebugAxes';

const ThreeScene = ({ 
  nodes, 
  connections, 
  activeConnection, 
  viewMode, 
  activeTool, 
  controlsRef, 
  handleNodeUpdate 
}) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid size={100} divisions={24} />
      <DebugAxes />
      
      {nodes.map(node => (
        <ThreeDNode 
          key={node.id}
          node={node}
          activeTool={activeTool}
          onUpdate={(newPosition) => {
            const lockedPosition = viewMode === '2d' 
              ? [newPosition[0], 0, newPosition[2]]
              : newPosition;
            
            handleNodeUpdate(node.id, lockedPosition);
          }}
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
        maxPolarAngle={viewMode === '2d' ? 0 : Math.PI / 2}
      />
    </>
  );
};

export default ThreeScene;
import React from 'react';
import { OrbitControls } from '@react-three/drei';
import Grid from '../Grid';
import ThreeDNode from '../ThreeDNode';
import ConnectionLine from '../ConnectionLine';

const ThreeDScene = ({ 
  nodes, 
  connections, 
  activeConnection, 
  activeTool, 
  viewMode, 
  handleNodeUpdate, 
  handleStartConnection, 
  handleEndConnection 
}) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid size={100} divisions={24} rotation={[-Math.PI / 2, 0, 0]} /> {/* Rotated grid */}
      
      {nodes.map(node => (
        <ThreeDNode 
          key={node.id}
          node={{
            ...node,
            // Map position to X-Y plane, with Z pushed back
            position: [
              node.position[0],
              node.position[2], // Y coordinate from original Z
              -20 // Fixed Z position (pushed back)
            ]
          }}
          activeTool={activeTool}
          onUpdate={(newPosition) => {
            // Map back to original coordinate system
            handleNodeUpdate(node.id, [
              newPosition[0],
              0,
              newPosition[1]
            ]);
          }}
          onStartConnection={handleStartConnection}
          onEndConnection={handleEndConnection}
        />
      ))}

      {connections.map(connection => (
        <ConnectionLine
          key={connection.id}
          start={[
            connection.sourcePosition[0],
            connection.sourcePosition[2],
            -20
          ]}
          end={[
            connection.targetPosition[0],
            connection.targetPosition[2],
            -20
          ]}
        />
      ))}

      {activeConnection && (
        <ConnectionLine
          start={[
            activeConnection.sourcePosition[0],
            activeConnection.sourcePosition[2],
            -20
          ]}
          end={[
            activeConnection.targetPosition[0],
            activeConnection.targetPosition[2],
            -20
          ]}
        />
      )}

      <OrbitControls 
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

export default ThreeDScene;
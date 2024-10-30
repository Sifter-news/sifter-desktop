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
  onStartConnection = () => {},
  onEndConnection = () => {},
  setActiveConnection = () => {},
  zoom = 1 // Add zoom prop with default value
}) => {
  const { camera } = useThree();

  // Update camera position when zoom changes
  React.useEffect(() => {
    if (camera) {
      camera.position.z = 200 / zoom;
      camera.updateProjectionMatrix();
    }
  }, [zoom, camera]);

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
      <Grid size={100} divisions={24} />
      {showGuides && <DebugAxes />}
      
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

      {camera && (
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={activeTool === 'pan'}
          enableRotate={activeTool === 'pan'}
          maxDistance={200 / zoom} // Adjust max distance based on zoom
          minDistance={10}
          camera={camera}
        />
      )}
    </group>
  );
};

export default ThreeScene;
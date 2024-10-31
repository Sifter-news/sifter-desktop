import React, { useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import Grid from '../Grid';
import ThreeDNode from './nodes/ThreeDNode';
import ThreeDFlatNode from './nodes/ThreeDFlatNode';
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

  useEffect(() => {
    if (camera && viewMode === '3d') {
      const distance = 20000 / zoom;
      camera.position.set(distance, distance, distance);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    } else if (camera) {
      camera.position.set(0, 0, 2000 / zoom);
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

  return (
    <group onPointerMove={handlePointerMove}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Grid size={100} divisions={24} />
      {showGuides && <DebugAxes />}
      
      {/* Original node at x=0 */}
      <ThreeDFlatNode 
        position={[0, 3, 0]}
        title="Node 1"
        subline="This is node one"
        avatarUrl="/default-image.png"
        onDelete={() => handleNodeUpdate({ id: 'node1', action: 'delete' })}
        onStyleChange={(style) => handleNodeUpdate({ id: 'node1', action: 'updateStyle', style })}
      />
      
      {/* Additional nodes spaced 8 units apart */}
      <ThreeDFlatNode 
        position={[8, 3, 0]}
        title="Node 2"
        subline="This is node two"
        avatarUrl="/default-image.png"
        onDelete={() => handleNodeUpdate({ id: 'node2', action: 'delete' })}
        onStyleChange={(style) => handleNodeUpdate({ id: 'node2', action: 'updateStyle', style })}
      />
      
      <ThreeDFlatNode 
        position={[16, 3, 0]}
        title="Node 3"
        subline="This is node three"
        avatarUrl="/default-image.png"
        onDelete={() => handleNodeUpdate({ id: 'node3', action: 'delete' })}
        onStyleChange={(style) => handleNodeUpdate({ id: 'node3', action: 'updateStyle', style })}
      />
      
      <ThreeDFlatNode 
        position={[24, 3, 0]}
        title="Node 4"
        subline="This is node four"
        avatarUrl="/default-image.png"
        onDelete={() => handleNodeUpdate({ id: 'node4', action: 'delete' })}
        onStyleChange={(style) => handleNodeUpdate({ id: 'node4', action: 'updateStyle', style })}
      />
      
      <ThreeDFlatNode 
        position={[32, 3, 0]}
        title="Node 5"
        subline="This is node five"
        avatarUrl="/default-image.png"
        onDelete={() => handleNodeUpdate({ id: 'node5', action: 'delete' })}
        onStyleChange={(style) => handleNodeUpdate({ id: 'node5', action: 'updateStyle', style })}
      />
    </group>
  );
};

export default ThreeScene;

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

  useEffect(() => {
    if (camera && controlsRef.current) {
      const updateDebugData = () => {
        setDebugData(prev => ({
          ...prev,
          camera: {
            position: { ...camera.position },
            rotation: { ...camera.rotation },
            fov: camera.fov,
            zoom: camera.zoom,
            distance: controlsRef.current.getDistance()
          }
        }));
      };

      updateDebugData();
      controlsRef.current.addEventListener('change', updateDebugData);
      return () => {
        controlsRef.current?.removeEventListener('change', updateDebugData);
      };
    }
  }, [camera, controlsRef, setDebugData]);

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
      />
      
      {/* Additional nodes spaced 8 units apart */}
      <ThreeDFlatNode 
        position={[8, 3, 0]}
        title="Node 2"
        subline="This is node two"
        avatarUrl="/default-image.png"
      />
      
      <ThreeDFlatNode 
        position={[16, 3, 0]}
        title="Node 3"
        subline="This is node three"
        avatarUrl="/default-image.png"
      />
      
      <ThreeDFlatNode 
        position={[24, 3, 0]}
        title="Node 4"
        subline="This is node four"
        avatarUrl="/default-image.png"
      />
      
      <ThreeDFlatNode 
        position={[32, 3, 0]}
        title="Node 5"
        subline="This is node five"
        avatarUrl="/default-image.png"
      />
      
      {nodes?.map(node => (
        <ThreeDNode 
          key={node.id}
          node={{
            ...node,
            position: [
              node.position_x || node.x || 0,
              node.position_y || node.y || 0,
              node.position_z || node.z || 0
            ],
            width: node.width || 256,
            height: node.height || 256
          }}
          activeTool={activeTool}
          onUpdate={handleNodeUpdate}
          onStartConnection={onStartConnection}
          onEndConnection={onEndConnection}
          allNodes={nodes}
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
            start={[sourceNode.position_x || 0, sourceNode.position_y + sourceY || 0, 0]}
            end={[targetNode.position_x || 0, targetNode.position_y + targetY || 0, 0]}
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
        maxDistance={2000 / zoom}
        minDistance={10}
        camera={camera}
      />
    </group>
  );
};

export default ThreeScene;
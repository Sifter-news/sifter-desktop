import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useDebug } from '@/contexts/DebugContext';
import { getNodeDimensions3D, createNodeMaterial } from '@/utils/threeDUtils';

const ThreeDNode = ({ 
  node, 
  activeTool, 
  onUpdate, 
  onStartConnection,
  onEndConnection,
  isHighlighted
}) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null);
  const { camera, gl } = useThree();

  const dimensions = getNodeDimensions3D(node.visualStyle);

  useFrame(() => {
    if (meshRef.current && node.visualStyle !== 'cube') {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  const handleInteractionStart = (e) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handleInteractionEnd = () => {
    if (activeTool !== 'select') return;
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
    if (hoveredConnectionPoint) {
      onEndConnection?.(node.id, hoveredConnectionPoint);
    }
  };

  const ConnectionPoint = ({ position, type }) => (
    <mesh
      position={position}
      onPointerEnter={() => setHoveredConnectionPoint(type)}
      onPointerLeave={() => setHoveredConnectionPoint(null)}
      onPointerDown={() => onStartConnection?.(node.id, node.position, type)}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color={hoveredConnectionPoint === type ? '#00ff00' : '#ffffff'} />
    </mesh>
  );

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onPointerEnter={() => {
          setIsHovered(true);
          gl.domElement.style.cursor = activeTool === 'select' ? 'pointer' : 'default';
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          setHoveredConnectionPoint(null);
          gl.domElement.style.cursor = 'default';
        }}
      >
        {node.visualStyle === 'cube' ? (
          <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        ) : (
          <planeGeometry args={[dimensions.width, dimensions.height]} />
        )}
        <primitive object={createNodeMaterial(isHovered, isHighlighted, node.visualStyle)} />
      </mesh>
      
      {node.visualStyle !== 'cube' && (
        <>
          <ConnectionPoint 
            position={[0, dimensions.height/2, 0.1]} 
            type="top" 
          />
          <ConnectionPoint 
            position={[0, -dimensions.height/2, 0.1]} 
            type="bottom" 
          />
        </>
      )}
    </group>
  );
};

export default ThreeDNode;
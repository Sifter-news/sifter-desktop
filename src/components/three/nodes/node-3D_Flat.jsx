import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useDebug } from '@/contexts/DebugContext';
import * as THREE from 'three';

const Node3DFlat = ({ 
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

  const dimensions = { width: 128, height: 128 }; // Adjust as needed
  
  const position = [
    node.position[0],
    node.position[1],
    node.position[2] || 0,
  ];

  useFrame(() => {
    if (meshRef.current) {
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
    <group position={position}>
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
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <meshBasicMaterial color={isHighlighted ? 'yellow' : 'gray'} />
      </mesh>

      <ConnectionPoint position={[0, dimensions.height / 2, 0]} type="top" />
      <ConnectionPoint position={[0, -dimensions.height / 2, 0]} type="bottom" />
    </group>
  );
};

export default Node3DFlat;

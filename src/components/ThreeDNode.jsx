import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDebug } from '@/contexts/DebugContext';

const ThreeDNode = ({ 
  node, 
  activeTool, 
  onUpdate, 
  onStartConnection,
  onEndConnection,
  isHighlighted,
  allNodes = []
}) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null);
  const { gl } = useThree();
  const { showNodeDebug } = useDebug();

  // Use consistent cube dimensions
  const size = 5; // 100px in Three.js units (1 unit = 20px)

  const handlePointerDown = (e) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = (e) => {
    if (activeTool !== 'select') return;
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
    handleConnectionEnd();
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    gl.domElement.style.cursor = activeTool === 'select' ? 'pointer' : 'default';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setHoveredConnectionPoint(null);
    gl.domElement.style.cursor = 'default';
  };

  const handleConnectionEnd = () => {
    onEndConnection?.(node.id, hoveredConnectionPoint);
  };

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial 
          color="white"
          transparent
          opacity={isHovered ? 0.8 : 1}
          wireframe={isHovered && !isDragging}
          emissive={isHighlighted ? "#ffffff" : "#000000"}
          emissiveIntensity={isHighlighted ? 0.5 : 0}
          roughness={0.3}
          metalness={0.1}
        />
        
        {/* Connection points */}
        <group position={[0, size/2, size/2]}>
          <mesh
            onPointerEnter={() => setHoveredConnectionPoint('top')}
            onPointerLeave={() => setHoveredConnectionPoint(null)}
            onPointerDown={() => onStartConnection?.(node.id, node.position, 'top')}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={hoveredConnectionPoint === 'top' ? '#00ff00' : '#ffffff'} />
          </mesh>
        </group>
        
        <group position={[0, -size/2, size/2]}>
          <mesh
            onPointerEnter={() => setHoveredConnectionPoint('bottom')}
            onPointerLeave={() => setHoveredConnectionPoint(null)}
            onPointerDown={() => onStartConnection?.(node.id, node.position, 'bottom')}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={hoveredConnectionPoint === 'bottom' ? '#00ff00' : '#ffffff'} />
          </mesh>
        </group>
      </mesh>
    </group>
  );
};

export default ThreeDNode;
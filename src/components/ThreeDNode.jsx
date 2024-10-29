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
  isHighlighted 
}) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null);
  const { gl } = useThree();
  const { showNodeDebug } = useDebug();

  const nodePosition = [
    node?.position?.[0] || 0,
    node?.position?.[1] || 0,
    node?.position?.[2] || 0
  ];

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
    <group position={nodePosition}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[4, 2, 0.2]} />
        <meshStandardMaterial 
          color="#4A90E2"
          transparent
          opacity={isHovered ? 0.8 : 1}
          wireframe={isHovered && !isDragging}
          emissive={isHighlighted ? "#ffffff" : "#000000"}
          emissiveIntensity={isHighlighted ? 0.5 : 0}
        />
        
        <group position={[0, 1, 0.1]}>
          <mesh
            onPointerEnter={() => setHoveredConnectionPoint('top')}
            onPointerLeave={() => setHoveredConnectionPoint(null)}
            onPointerDown={() => onStartConnection?.(node.id, nodePosition, 'top')}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={hoveredConnectionPoint === 'top' ? '#00ff00' : '#ffffff'} />
          </mesh>
        </group>
        
        <group position={[0, -1, 0.1]}>
          <mesh
            onPointerEnter={() => setHoveredConnectionPoint('bottom')}
            onPointerLeave={() => setHoveredConnectionPoint(null)}
            onPointerDown={() => onStartConnection?.(node.id, nodePosition, 'bottom')}
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
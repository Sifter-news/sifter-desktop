import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDebug } from '@/contexts/DebugContext';
import { NODE_STYLES } from '@/utils/nodeStyles';

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
  const { camera, gl } = useThree();
  const { showNodeDebug } = useDebug();

  // Convert database dimensions (pixels) to Three.js units (1 unit = ~20px)
  const width = (node.width || 256) / 20;
  const height = (node.height || 256) / 20;
  const depth = 0.5;

  // Make node face camera
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

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
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color="white"
          transparent
          opacity={isHovered ? 0.8 : 1}
          side={THREE.DoubleSide}
          emissive={isHighlighted ? "#ffffff" : "#000000"}
          emissiveIntensity={isHighlighted ? 0.5 : 0}
        />
      </mesh>
      
      {/* Connection points */}
      <group position={[0, height/2, 0.1]}>
        <mesh
          onPointerEnter={() => setHoveredConnectionPoint('top')}
          onPointerLeave={() => setHoveredConnectionPoint(null)}
          onPointerDown={() => onStartConnection?.(node.id, node.position, 'top')}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color={hoveredConnectionPoint === 'top' ? '#00ff00' : '#ffffff'} />
        </mesh>
      </group>
      
      <group position={[0, -height/2, 0.1]}>
        <mesh
          onPointerEnter={() => setHoveredConnectionPoint('bottom')}
          onPointerLeave={() => setHoveredConnectionPoint(null)}
          onPointerDown={() => onStartConnection?.(node.id, node.position, 'bottom')}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color={hoveredConnectionPoint === 'bottom' ? '#00ff00' : '#ffffff'} />
        </mesh>
      </group>
    </group>
  );
};

export default ThreeDNode;
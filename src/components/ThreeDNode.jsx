import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Text, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useDebug } from '@/contexts/DebugContext';

const ThreeDNode = ({ 
  node, 
  activeTool, 
  onUpdate, 
  isHighlighted,
  onFocus
}) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { gl } = useThree();
  const { showNodeDebug } = useDebug();

  const handlePointerDown = (e) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    if (activeTool !== 'select') return;
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    gl.domElement.style.cursor = activeTool === 'select' ? 'pointer' : 'default';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    gl.domElement.style.cursor = 'default';
  };

  const textureLoader = new THREE.TextureLoader();
  const avatarTexture = textureLoader.load(node.avatar || '/default-image.png');

  return (
    <group position={node.position}>
      {/* Background plane */}
      <Plane
        ref={meshRef}
        args={[node.dimensions.width, node.dimensions.height]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={() => onFocus?.(node.id)}
      >
        <meshStandardMaterial 
          color={isHighlighted ? "#4a9eff" : "#ffffff"}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </Plane>

      {/* Avatar */}
      <Plane
        position={[-node.dimensions.width/2 + 0.5, node.dimensions.height/2 - 0.5, 0.01]}
        args={[1, 1]}
      >
        <meshBasicMaterial 
          map={avatarTexture}
          transparent
          side={THREE.DoubleSide}
        />
      </Plane>

      {/* Title text */}
      <Text
        position={[0, node.dimensions.height/2 - 0.3, 0.01]}
        fontSize={0.3}
        color="#000000"
        anchorX="center"
        anchorY="top"
        maxWidth={node.dimensions.width - 0.4}
      >
        {node.title}
      </Text>
    </group>
  );
};

export default ThreeDNode;
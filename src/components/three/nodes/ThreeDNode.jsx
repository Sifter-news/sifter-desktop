import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useDebug } from '@/contexts/DebugContext';
import { getNodeDimensions3D, createNodeMaterial } from '@/utils/threeDUtils';

const ThreeDNode = ({ 
  node, 
  activeTool, 
  onUpdate, 
  onStartConnection,
  onEndConnection,
  isHighlighted,
  position = [0, 0, 0],
  title,
  subline,
  avatarUrl = '/default-image.png'
}) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null);
  const { camera, gl } = useThree();
  const textureLoader = new THREE.TextureLoader();
  const avatarTexture = textureLoader.load(avatarUrl);

  const dimensions = getNodeDimensions3D(node?.visualStyle);
  const nodePosition = position || [
    node?.position?.[0] || 0,
    node?.position?.[1] || 0,
    (node?.position?.[2] || 0) * 2
  ];

  useFrame(() => {
    if (meshRef.current && node?.visualStyle !== 'cube') {
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
      onPointerDown={() => onStartConnection?.(node.id, nodePosition, type)}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color={hoveredConnectionPoint === type ? '#00ff00' : '#ffffff'} />
    </mesh>
  );

  return (
    <Billboard follow={!node?.visualStyle?.includes('cube')} position={nodePosition}>
      <group>
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
          {node?.visualStyle === 'cube' ? (
            <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
          ) : (
            <planeGeometry args={[dimensions.width, dimensions.height]} />
          )}
          <primitive object={createNodeMaterial(isHovered, isHighlighted, node?.visualStyle)} />
        </mesh>

        {/* Avatar circle */}
        <mesh position={[-dimensions.width/3, 0, 0.01]}>
          <circleGeometry args={[dimensions.height/4, 32]} />
          <meshBasicMaterial map={avatarTexture} transparent />
        </mesh>

        {/* Title text */}
        <Text
          position={[-dimensions.width/4, dimensions.height/4, 0.01]}
          fontSize={dimensions.height/6}
          color="black"
          anchorX="left"
          anchorY="middle"
        >
          {node?.title || title || 'Title'}
        </Text>

        {/* Subline text */}
        <Text
          position={[-dimensions.width/4, -dimensions.height/4, 0.01]}
          fontSize={dimensions.height/8}
          color="gray"
          anchorX="left"
          anchorY="middle"
        >
          {node?.description || subline || 'Description'}
        </Text>

        {!node?.visualStyle?.includes('cube') && (
          <>
            <ConnectionPoint position={[0, dimensions.height/2, 0.1]} type="top" />
            <ConnectionPoint position={[0, -dimensions.height/2, 0.1]} type="bottom" />
          </>
        )}
      </group>
    </Billboard>
  );
};

export default ThreeDNode;
import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber'; // React Three Fiber hooks
import { useDebug } from '@/contexts/DebugContext';
import { getNodeDimensions3D, createNodeMaterial } from '@/utils/threeDUtils';

// Node3DDefault: A more traditional 3D node that can be viewed from different angles
// This is good for spatial relationships and 3D visualization
const Node3DDefault = ({ 
  node, 
  activeTool, 
  onUpdate, 
  onStartConnection,
  onEndConnection,
  isHighlighted
}) => {
  // References and state management
  const meshRef = useRef(); // Reference to the 3D mesh
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null);
  const { camera, gl } = useThree(); // Access to Three.js camera and renderer

  // Get the dimensions based on the node's visual style
  const dimensions = getNodeDimensions3D(node.visualStyle);
  
  // Calculate the node's position in 3D space
  const position = [
    node.position[0],
    node.position[1],
    node.position[2] * 2 || 0 // Double Z position for better depth perception
  ];

  // Make non-cube nodes always face the camera
  useFrame(() => {
    if (meshRef.current && node.visualStyle !== 'cube') {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  // Handle mouse/touch interactions
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

  // Connection points for linking nodes together

  const ConnectionPoint = ({ position, type }) => (
    <mesh
      position={position}
      onPointerEnter={() => setHoveredConnectionPoint(type)}
      onPointerLeave={() => setHoveredConnectionPoint(null)}
      onPointerDown={() => onStartConnection?.(node.id, node.position, type)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={hoveredConnectionPoint === type ? '#00ff00' : '#ffffff'} />
    </mesh>
  );

  return (
    <group position={position}>
      {/* Main node mesh */}
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
        {/* Use box geometry for cube style, plane for others */}
        {node.visualStyle === 'cube' ? (
          <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        ) : (
          <planeGeometry args={[dimensions.width, dimensions.height]} />
        )}
        <primitive object={createNodeMaterial(isHovered, isHighlighted, node.visualStyle)} />
      </mesh>
      
      {/* Add connection points for non-cube nodes */}
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

export default Node3DDefault;


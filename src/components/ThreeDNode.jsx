import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import NodeStyleTooltip from './node/NodeStyleTooltip';
import ConnectionDot from './node/ConnectionDot';

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
  const [isConnecting, setIsConnecting] = useState(false);
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null);
  const { camera, gl } = useThree();

  const handlePointerDown = (e) => {
    if (activeTool !== 'select') return;

    if (e.button === 2) {
      e.stopPropagation();
      setIsConnecting(true);
      const connectionPoint = hoveredConnectionPoint || 'top';
      onStartConnection(node.id, node.position, connectionPoint);
      return;
    }

    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = (e) => {
    if (activeTool !== 'select') return;

    if (isConnecting) {
      setIsConnecting(false);
      onEndConnection(node.id, hoveredConnectionPoint || 'bottom');
      return;
    }
    setIsDragging(false);
    gl.domElement.style.cursor = activeTool === 'select' ? 'default' : 'grab';
  };

  const handleConnectionPointHover = (point) => {
    setHoveredConnectionPoint(point);
    gl.domElement.style.cursor = 'crosshair';
  };

  const handleConnectionPointLeave = () => {
    setHoveredConnectionPoint(null);
    gl.domElement.style.cursor = 'default';
  };

  // Keep node facing camera
  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <boxGeometry args={[5, 5, 0.2]} />
      <meshStandardMaterial 
        color="#4A90E2"
        transparent
        opacity={isHovered ? 0.8 : 1}
        wireframe={isHovered && !isDragging}
        emissive={isHighlighted ? "#ffffff" : "#000000"}
        emissiveIntensity={isHighlighted ? 0.5 : 0}
      />
      
      <Html position={[0, 2.5, 0.1]}>
        <ConnectionDot 
          position="top"
          isHovered={hoveredConnectionPoint === 'top'}
          onHover={() => handleConnectionPointHover('top')}
          onLeaveHover={handleConnectionPointLeave}
          onStartConnection={(point) => onStartConnection(node.id, node.position, point)}
        />
      </Html>

      <Html position={[0, -2.5, 0.1]}>
        <ConnectionDot 
          position="bottom"
          isHovered={hoveredConnectionPoint === 'bottom'}
          onHover={() => handleConnectionPointHover('bottom')}
          onLeaveHover={handleConnectionPointLeave}
          onStartConnection={(point) => onStartConnection(node.id, node.position, point)}
        />
      </Html>
      
      <Html
        position={[0, 0, 0.1]}
        center
        style={{
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {node?.title || 'Untitled Node'}
      </Html>
    </mesh>
  );
};

export default ThreeDNode;

import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import NodeStyleTooltip from './node/NodeStyleTooltip';

const ThreeDNode = ({ 
  node, 
  activeTool, 
  onUpdate, 
  onStartConnection, 
  onEndConnection,
  isHighlighted // Add this prop
}) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const { camera, gl } = useThree();

  // Ensure node position has default values
  const nodePosition = [
    node?.position?.[0] || 0,
    node?.position?.[1] || 0,
    node?.position?.[2] || 0
  ];

  const handlePointerDown = (e) => {
    if (activeTool !== 'select') return;

    if (e.button === 2) {
      e.stopPropagation();
      setIsConnecting(true);
      onStartConnection(node.id, nodePosition);
      return;
    }

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      position: [...nodePosition]
    });
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = (e) => {
    if (activeTool !== 'select') return;

    if (isConnecting) {
      setIsConnecting(false);
      onEndConnection(node.id);
      return;
    }
    setIsDragging(false);
    gl.domElement.style.cursor = activeTool === 'select' ? 'default' : 'grab';
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragStart || activeTool !== 'select') return;

    const deltaX = (e.clientX - dragStart.x) * 0.1;
    const deltaY = (e.clientY - dragStart.y) * 0.1;

    // Get camera rotation around Y axis (yaw)
    const cameraRotation = camera.rotation.y;

    // Calculate new position based on camera rotation
    // This ensures movement is relative to the camera view
    const newX = dragStart.position[0] + (deltaX * Math.cos(cameraRotation) - deltaY * Math.sin(cameraRotation));
    const newY = dragStart.position[1]; // Lock Y axis in 3D space
    const newZ = dragStart.position[2] + (deltaX * Math.sin(cameraRotation) + deltaY * Math.cos(cameraRotation));

    // Keep the original Y position, only update X and Z
    const newPosition = [newX, dragStart.position[1], newZ];
    onUpdate(newPosition);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (activeTool === 'select') {
      gl.domElement.style.cursor = 'pointer';
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (activeTool === 'select') {
      gl.domElement.style.cursor = 'default';
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
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
      position={nodePosition}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
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

      {showTooltip && (
        <Html
          position={[0, 3, 0]}
          center
          style={{
            pointerEvents: 'auto',
            transform: 'translateY(-100%)',
            zIndex: 1000
          }}
        >
          <NodeStyleTooltip
            onStyleChange={(style) => onUpdate({ ...node, visualStyle: style })}
            onTextSizeChange={(size) => onUpdate({ ...node, textSize: size })}
            onAlignmentChange={(align) => onUpdate({ ...node, textAlign: align })}
            onTypeChange={(type) => onUpdate({ ...node, nodeType: type })}
            onColorChange={(color) => onUpdate({ ...node, color })}
            onEdit={() => {/* Implement edit modal trigger */}}
            onAIChat={() => {/* Implement AI chat panel trigger */}}
            position={{ x: 0, y: -8 }}
          />
        </Html>
      )}
    </mesh>
  );
};

export default ThreeDNode;
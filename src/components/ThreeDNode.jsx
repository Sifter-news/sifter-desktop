import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import NodeStyleTooltip from './node/NodeStyleTooltip';

const ThreeDNode = ({ 
  node, 
  activeTool, 
  onUpdate, 
  onStartConnection, 
  onEndConnection 
}) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const { camera, gl } = useThree();

  const handlePointerDown = (e) => {
    if (activeTool !== 'select') return;

    if (e.button === 2) { // Right click
      e.stopPropagation();
      setIsConnecting(true);
      onStartConnection(node.id, node.position);
      return;
    }

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      position: [...node.position]
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
    const deltaZ = (e.clientY - dragStart.y) * 0.1;

    const cameraRotation = camera.rotation.y;
    const newX = dragStart.position[0] + (deltaX * Math.cos(cameraRotation) - deltaZ * Math.sin(cameraRotation));
    const newZ = dragStart.position[2] + (deltaX * Math.sin(cameraRotation) + deltaZ * Math.cos(cameraRotation));

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

  useFrame(() => {
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
      />
      
      {/* Node Content */}
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
        {node.title}
      </Html>

      {/* Debug Info */}
      <Html
        position={[0, -4, 0]}
        center
        style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#00ff00',
          padding: '4px',
          borderRadius: '2px',
          fontFamily: 'monospace',
          fontSize: '10px',
          whiteSpace: 'pre-wrap',
          pointerEvents: 'none'
        }}
      >
        {`Component: ThreeDNode\nPos: [${node.position[0].toFixed(2)}, ${node.position[1].toFixed(2)}, ${node.position[2].toFixed(2)}]`}
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
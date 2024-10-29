import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDebug } from '@/contexts/DebugContext';
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
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const { camera, gl } = useThree();
  const { showNodeDebug } = useDebug();

  const nodePosition = [
    node?.position?.[0] || 0,
    node?.position?.[1] || 0,
    node?.position?.[2] || 0
  ];

  const handleConnectionStart = (point) => {
    const connectionPosition = [...nodePosition];
    if (point === 'top') {
      connectionPosition[1] += 2.5;
    } else if (point === 'bottom') {
      connectionPosition[1] -= 2.5;
    }
    onStartConnection?.(node.id, connectionPosition, point);
  };

  const handleConnectionEnd = () => {
    onEndConnection?.(node.id, hoveredConnectionPoint);
  };

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

  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group position={nodePosition}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
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
        
        {/* Connection Points */}
        <group position={[0, 2.5, 0.1]}>
          <mesh
            onPointerEnter={() => setHoveredConnectionPoint('top')}
            onPointerLeave={() => setHoveredConnectionPoint(null)}
            onPointerDown={() => handleConnectionStart('top')}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={hoveredConnectionPoint === 'top' ? '#00ff00' : '#ffffff'} />
          </mesh>
        </group>
        
        <group position={[0, -2.5, 0.1]}>
          <mesh
            onPointerEnter={() => setHoveredConnectionPoint('bottom')}
            onPointerLeave={() => setHoveredConnectionPoint(null)}
            onPointerDown={() => handleConnectionStart('bottom')}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={hoveredConnectionPoint === 'bottom' ? '#00ff00' : '#ffffff'} />
          </mesh>
        </group>

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
          <div className="flex flex-col items-center">
            <span>{node?.title || 'Untitled Node'}</span>
            {showNodeDebug && (
              <div className="text-xs text-gray-500 mt-1">
                <div>Type: {node?.type || 'generic'}</div>
                <div>Style: {node?.visualStyle || 'default'}</div>
                <div>Pos: ({nodePosition.join(', ')})</div>
              </div>
            )}
          </div>
        </Html>
      </mesh>
    </group>
  );
};

export default ThreeDNode;

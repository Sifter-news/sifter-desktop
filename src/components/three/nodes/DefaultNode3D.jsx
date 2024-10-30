import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const DefaultNode3D = () => {
  const size = 32; // 256px / 8 (our scale factor)
  const width = size * 3; // Tripled width
  const height = size;
  const depth = size;
  
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const edges = new THREE.EdgesGeometry(geometry);
  
  return (
    <group>
      {/* 3D wireframe outline */}
      <lineSegments>
        <primitive object={edges} />
        <lineBasicMaterial color="white" opacity={0.5} transparent />
      </lineSegments>
      
      {/* Background white plane */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="white" opacity={0.9} transparent />
      </mesh>

      {/* Foreground content */}
      <group position={[0, 0, 0.75]}>
        {/* Avatar with circular mask and outline */}
        <mesh position={[-width/2 + size/4, 0, 0]}>
          <circleGeometry args={[size/4, 32]} />
          <meshBasicMaterial 
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.CircleGeometry(size/4, 32)]} />
            <lineBasicMaterial color="white" />
          </lineSegments>
        </mesh>

        {/* Title text */}
        <Text
          position={[-width/2 + size/2 + size/4, size/6, 0]}
          fontSize={size/6}
          color="black"
          anchorX="left"
          anchorY="middle"
        >
          Title
        </Text>

        {/* Subline text */}
        <Text
          position={[-width/2 + size/2 + size/4, -size/6, 0]}
          fontSize={size/8}
          color="gray"
          anchorX="left"
          anchorY="middle"
        >
          Subline text here
        </Text>
      </group>
    </group>
  );
};

export default DefaultNode3D;
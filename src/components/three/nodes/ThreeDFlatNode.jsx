import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const ThreeDFlatNode = ({ 
  node,
  position = [0, 0, 0],
  title = "Title",
  subline = "Subline",
  avatarUrl = "/default-image.png"
}) => {
  const groupRef = useRef();
  const textureLoader = new THREE.TextureLoader();
  const avatarTexture = textureLoader.load(avatarUrl);

  // Create circular shape for avatar with padding
  const avatarGeometry = new THREE.CircleGeometry(0.5, 32);
  const avatarMaterial = new THREE.MeshBasicMaterial({
    map: avatarTexture,
    transparent: true,
    side: THREE.DoubleSide
  });

  // Add 24px padding (converted to Three.js units - 24px = 0.75 units at our scale)
  const padding = 0.75;
  const contentWidth = 4;
  const contentHeight = 2;
  const totalWidth = contentWidth + (padding * 2);
  const totalHeight = contentHeight + (padding * 2);

  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      <group ref={groupRef} position={position}>
        {/* Background plane with padding */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[totalWidth, totalHeight]} />
          <meshBasicMaterial color="white" transparent opacity={0.9} />
        </mesh>

        {/* Content group with padding offset */}
        <group position={[-padding, 0, 0]}>
          {/* Avatar circle */}
          <mesh position={[-1.5, 0, 0]}>
            <primitive object={avatarGeometry} />
            <primitive object={avatarMaterial} />
          </mesh>

          {/* Title text */}
          <Text
            position={[-0.5, 0.3, 0]}
            fontSize={0.2}
            color="black"
            anchorX="left"
            anchorY="middle"
          >
            {title}
          </Text>

          {/* Subline text */}
          <Text
            position={[-0.5, -0.1, 0]}
            fontSize={0.15}
            color="gray"
            anchorX="left"
            anchorY="middle"
          >
            {subline}
          </Text>
        </group>
      </group>
    </Billboard>
  );
};

export default ThreeDFlatNode;
import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const ThreeDFlatNode = ({ 
  position = [0, 0, 0],
  title = "Title",
  subline = "Subline",
  avatarUrl = "/default-image.png"
}) => {
  const groupRef = useRef();
  const textureLoader = new THREE.TextureLoader();
  const avatarTexture = textureLoader.load(avatarUrl);

  // Create circular shape for avatar
  const avatarGeometry = new THREE.CircleGeometry(0.5, 32);
  const avatarMaterial = new THREE.MeshBasicMaterial({
    map: avatarTexture,
    transparent: true,
    side: THREE.DoubleSide
  });

  // Convert 24px margin to Three.js units (24px / 8 = 3 units)
  const avatarMargin = 3;

  return (
    <group position={position}>
      {/* Background plane */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[4, 2]} />
        <meshBasicMaterial color="white" transparent opacity={0.9} />
      </mesh>

      {/* Avatar circle with margin */}
      <mesh position={[-1.5 - avatarMargin/2, 0, 0]}>
        <primitive object={avatarGeometry} />
        <primitive object={avatarMaterial} />
      </mesh>

      {/* Title text - adjusted position to account for avatar margin */}
      <Text
        position={[-1.5 + avatarMargin/2, 0.3, 0]}
        fontSize={0.2}
        color="black"
        anchorX="left"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Subline text - adjusted position to account for avatar margin */}
      <Text
        position={[-1.5 + avatarMargin/2, -0.1, 0]}
        fontSize={0.15}
        color="gray"
        anchorX="left"
        anchorY="middle"
      >
        {subline}
      </Text>
    </group>
  );
};

export default ThreeDFlatNode;
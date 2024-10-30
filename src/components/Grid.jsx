import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const GridLayer = ({ z = 0, opacity = 0.3, divisions = 500, spacing = 16 }) => {
  const size = spacing * divisions; // Total size will be 8000 units (16 * 500) - doubled from previous 4000
  
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.position.z = z;
  gridHelper.rotation.x = Math.PI / 2;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = opacity;
  gridHelper.material.depthWrite = false;
  
  if (gridHelper.material instanceof THREE.LineBasicMaterial) {
    const centerLineMaterial = gridHelper.material.clone();
    centerLineMaterial.opacity = opacity;
    gridHelper.material = [centerLineMaterial, gridHelper.material];
  }

  const dotGeometry = new THREE.BufferGeometry();
  const positions = [];
  const halfSize = size / 2;

  // Keep dot spacing at 32 units
  const dotSpacing = 32;

  for (let i = -halfSize; i <= halfSize; i += dotSpacing) {
    for (let j = -halfSize; j <= halfSize; j += dotSpacing) {
      positions.push(i, j, z);
    }
  }

  dotGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );

  return (
    <group>
      <primitive object={gridHelper} />
      <points>
        <bufferGeometry attach="geometry" {...dotGeometry} />
        <pointsMaterial
          attach="material"
          size={2}
          sizeAttenuation={false}
          color={0xffffff}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

const FlatNode = () => {
  const width = 32 * 3; // 96 units wide
  const height = 32; // 32 units tall
  
  return (
    <group position={[0, 96, 0]}>
      {/* Background plane */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="white" opacity={0.9} transparent />
      </mesh>

      {/* Avatar circle */}
      <mesh position={[-width/2 + height/2, 0, 0.1]}>
        <circleGeometry args={[height/2, 32]} />
        <meshBasicMaterial color="#f3f4f6" />
        <lineSegments>
          <edgesGeometry args={[new THREE.CircleGeometry(height/2, 32)]} />
          <lineBasicMaterial color="#e5e7eb" />
        </lineSegments>
      </mesh>

      {/* Title text */}
      <Text
        position={[-width/2 + height + 4, height/4, 0.1]}
        fontSize={height/3}
        color="black"
        anchorX="left"
        anchorY="middle"
      >
        Flat Node Title
      </Text>

      {/* Subtitle text */}
      <Text
        position={[-width/2 + height + 4, -height/4, 0.1]}
        fontSize={height/4}
        color="gray"
        anchorX="left"
        anchorY="middle"
      >
        Subtitle here
      </Text>
    </group>
  );
};

const Grid = ({ divisions = 500 }) => {
  const gridPositions = [
    96, 48,
    0,
    -48, -96
  ];
  const baseOpacity = 0.45;
  
  return (
    <group>
      {gridPositions.map((zPos, index) => (
        <GridLayer 
          key={`grid-${index}`}
          z={zPos} 
          opacity={zPos === 0 ? baseOpacity : 0.1}
          divisions={divisions} 
        />
      ))}
      <FlatNode />
    </group>
  );
};

export default Grid;

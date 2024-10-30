import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

const GridLayer = ({ z = 0, opacity = 0.3, divisions = 250, spacing = 16 }) => {
  const size = spacing * divisions; // Total size will be 4000 units (16 * 250)
  
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.position.z = z;
  gridHelper.rotation.x = Math.PI / 2; // Rotate to make it vertical on Z axis
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = opacity;
  gridHelper.material.depthWrite = false; // Prevent z-fighting
  
  if (gridHelper.material instanceof THREE.LineBasicMaterial) {
    const centerLineMaterial = gridHelper.material.clone();
    centerLineMaterial.opacity = opacity;
    gridHelper.material = [centerLineMaterial, gridHelper.material];
  }

  const dotGeometry = new THREE.BufferGeometry();
  const positions = [];
  const halfSize = size / 2;

  // Changed dot spacing to 32 for all layers
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

const DefaultNode3D = () => {
  const size = 32; // 256px / 8 (our new scale factor)
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

      {/* Foreground content - moved forward by 6px (0.75 in our new scale) */}
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

        {/* Title text - increased size */}
        <Text
          position={[-width/2 + size/2 + size/4, size/6, 0]}
          fontSize={size/6}
          color="black"
          anchorX="left"
          anchorY="middle"
        >
          Title
        </Text>

        {/* Subline text - increased size */}
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

const Grid = ({ divisions = 250 }) => {
  const gridPositions = [
    48, 24, // Positive z layers
    0,      // Base layer
    -24, -48 // Negative z layers
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
      <DefaultNode3D />
    </group>
  );
};

export default Grid;
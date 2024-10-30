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
  
  if (gridHelper.material instanceof THREE.LineBasicMaterial) {
    const centerLineMaterial = gridHelper.material.clone();
    centerLineMaterial.opacity = opacity;
    gridHelper.material = [centerLineMaterial, gridHelper.material];
  }

  const dotGeometry = new THREE.BufferGeometry();
  const positions = [];
  const halfSize = size / 2;

  // Use 8px spacing for z=0, 16px for other layers
  const dotSpacing = z === 0 ? 8 : 16;

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
        />
      </points>
    </group>
  );
};

const CubeOutline = () => {
  const size = 12.8; // 256px / 20 (our standard scale factor)
  const width = size * 3; // Tripled width
  const height = size;
  const depth = size;
  
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const edges = new THREE.EdgesGeometry(geometry);
  
  return (
    <group position={[0, 0, size/2]}>
      {/* Wireframe outline */}
      <lineSegments>
        <primitive object={edges} />
        <lineBasicMaterial color="white" opacity={0.5} transparent />
      </lineSegments>
      
      {/* Solid front face with content */}
      <group position={[0, 0, size/2]}>
        {/* Main white background */}
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="white" opacity={0.9} transparent />
        </mesh>

        {/* Avatar */}
        <mesh position={[-width/2 + size/4, 0, 0.01]}>
          <planeGeometry args={[size/2, size/2]} />
          <meshBasicMaterial>
            <texture attach="map" url="/default-image.png" />
          </meshBasicMaterial>
        </mesh>

        {/* Title text */}
        <Text
          position={[0, size/4, 0.01]}
          fontSize={size/8}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          Title
        </Text>

        {/* Subline text */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={size/12}
          color="gray"
          anchorX="center"
          anchorY="middle"
        >
          Subline text here
        </Text>
      </group>
    </group>
  );
};

const Grid = ({ divisions = 250 }) => {
  // Create grid layers with 24px increments, including positive z
  const gridPositions = [
    48, 24, // Positive z layers
    0,      // Base layer
    -24, -48 // Negative z layers
  ];
  const baseOpacity = 0.45; // Increased from 0.3 to 0.45
  
  return (
    <group>
      {gridPositions.map((zPos, index) => (
        <GridLayer 
          key={`grid-${index}`}
          z={zPos} 
          opacity={zPos === 0 ? baseOpacity : 0.1} // Base layer at 45% opacity, rest at 10%
          divisions={divisions} 
        />
      ))}
      <CubeOutline />
    </group>
  );
};

export default Grid;

import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import DefaultNode3D from './three/nodes/DefaultNode3D';

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

const Grid = ({ divisions = 500 }) => {  
  const gridPositions = [
    96, 48,  // Doubled positive z layers
    0,       // Base layer
    -48, -96 // Doubled negative z layers
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

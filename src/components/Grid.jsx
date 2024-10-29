import React from 'react';
import * as THREE from 'three';

const GridLayer = ({ z = 0, opacity = 0.2, size = 100, divisions = 24 }) => {
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.position.z = z;
  gridHelper.rotation.x = Math.PI / 2; // Rotate to make it vertical on Z axis
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = opacity;
  
  if (gridHelper.material instanceof THREE.LineBasicMaterial) {
    const centerLineMaterial = gridHelper.material.clone();
    centerLineMaterial.opacity = opacity * 0.7;
    gridHelper.material = [centerLineMaterial, gridHelper.material];
  }

  const dotGeometry = new THREE.BufferGeometry();
  const positions = [];
  const halfSize = size / 2;
  const spacing = size / divisions;

  for (let i = -halfSize; i <= halfSize; i += spacing) {
    for (let j = -halfSize; j <= halfSize; j += spacing) {
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

const Grid = ({ size = 100, divisions = 24 }) => {
  // Create array of Z positions for positive and negative sides
  const zPositions = [
    ...Array.from({ length: 8 }, (_, i) => -(i + 1) * 8), // Negative Z positions
    ...Array.from({ length: 8 }, (_, i) => (i + 1) * 8),  // Positive Z positions
  ].sort((a, b) => Math.abs(a) - Math.abs(b)); // Sort by distance from center

  return (
    <group>
      {/* Add center grid at z=0 with 0.3 opacity */}
      <GridLayer 
        key={0} 
        z={0} 
        opacity={0.3}
        size={size} 
        divisions={divisions} 
      />
      {zPositions.map((z) => (
        <GridLayer 
          key={z} 
          z={z} 
          opacity={0.3 * (1 - Math.abs(z) / (8 * 8))} // Start from 0.3 and fade with distance
          size={size} 
          divisions={divisions} 
        />
      ))}
    </group>
  );
};

export default Grid;
import React from 'react';
import * as THREE from 'three';

const Grid = ({ size = 100, divisions = 24 }) => {
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;

  const dotGeometry = new THREE.BufferGeometry();
  const positions = [];
  const halfSize = size / 2;
  const spacing = size / divisions;

  for (let i = -halfSize; i <= halfSize; i += spacing) {
    for (let j = -halfSize; j <= halfSize; j += spacing) {
      positions.push(i, 0, j);
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
          opacity={0.5}
        />
      </points>
    </group>
  );
};

export default Grid;
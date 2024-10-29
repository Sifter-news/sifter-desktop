import React from 'react';
import * as THREE from 'three';

const GridLayer = ({ y = 0, opacity = 0.2, size = 100, divisions = 24 }) => {
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.position.y = y;
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
      positions.push(i, y, j);
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
  return (
    <group>
      <GridLayer y={0} opacity={0.2} size={size} divisions={divisions} />
      <GridLayer y={16} opacity={0.16} size={size} divisions={divisions} />
      <GridLayer y={32} opacity={0.12} size={size} divisions={divisions} />
      <GridLayer y={48} opacity={0.08} size={size} divisions={divisions} />
      <GridLayer y={64} opacity={0.04} size={size} divisions={divisions} />
    </group>
  );
};

export default Grid;
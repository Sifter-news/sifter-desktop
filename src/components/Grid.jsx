import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

const GridLayer = ({ y = 0, opacity = 0.2, size = 100, divisions = 24, showLabels = true }) => {
  // Create grid helper with reduced opacity for center lines
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.position.y = y;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = opacity;
  
  // Reduce opacity of center lines by 30%
  if (gridHelper.material instanceof THREE.LineBasicMaterial) {
    const centerLineMaterial = gridHelper.material.clone();
    centerLineMaterial.opacity = opacity * 0.7; // 30% reduction
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

  if (!showLabels) {
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
  }

  // Create coordinate labels in 16px increments
  const labels = [];
  const step = 16;
  
  // X axis labels (red)
  for (let x = -halfSize; x <= halfSize; x += step) {
    labels.push(
      <Text
        key={`x${x}${y}`}
        position={[x, y + 0.5, -halfSize - 5]}
        color="red"
        fontSize={4}
        anchorX="center"
        anchorY="middle"
      >
        {`X: ${Math.round(x)}`}
      </Text>
    );
  }
  
  // Z axis labels (blue)
  for (let z = -halfSize; z <= halfSize; z += step) {
    labels.push(
      <Text
        key={`z${z}${y}`}
        position={[-halfSize - 5, y + 0.5, z]}
        color="blue"
        fontSize={4}
        anchorX="center"
        anchorY="middle"
      >
        {`Z: ${Math.round(z)}`}
      </Text>
    );
  }
  
  // Y axis label (green)
  labels.push(
    <Text
      key={`y${y}`}
      position={[-halfSize - 10, y, -halfSize - 10]}
      color="green"
      fontSize={4}
      anchorX="center"
      anchorY="middle"
    >
      {`Y: ${Math.round(y)}`}
    </Text>
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
      {labels}
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
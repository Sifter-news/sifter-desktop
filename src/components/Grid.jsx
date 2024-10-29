import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

const Grid = ({ size = 100, divisions = 24 }) => {
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;

  const createGridLayer = (yPosition) => {
    const dotGeometry = new THREE.BufferGeometry();
    const positions = [];
    const halfSize = size / 2;
    const spacing = size / divisions;

    for (let i = -halfSize; i <= halfSize; i += spacing) {
      for (let j = -halfSize; j <= halfSize; j += spacing) {
        positions.push(i, yPosition, j);
      }
    }

    dotGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    return dotGeometry;
  };

  // Create coordinate labels for each layer
  const createLabels = (yPosition) => {
    const labels = [];
    const step = size / 4;
    const halfSize = size / 2;
    
    // X axis labels (red)
    for (let x = -halfSize; x <= halfSize; x += step) {
      labels.push(
        <Text
          key={`x${x}y${yPosition}`}
          position={[x, yPosition + 0.5, -halfSize - 5]}
          color="red"
          fontSize={4}
          anchorX="center"
          anchorY="middle"
        >
          {Math.round(x)}
        </Text>
      );
    }
    
    // Z axis labels (blue)
    for (let z = -halfSize; z <= halfSize; z += step) {
      labels.push(
        <Text
          key={`z${z}y${yPosition}`}
          position={[-halfSize - 5, yPosition + 0.5, z]}
          color="blue"
          fontSize={4}
          anchorX="center"
          anchorY="middle"
        >
          {Math.round(z)}
        </Text>
      );
    }
    
    // Y position label (green)
    labels.push(
      <Text
        key={`y${yPosition}`}
        position={[-halfSize - 10, yPosition, -halfSize - 10]}
        color="green"
        fontSize={4}
        anchorX="center"
        anchorY="middle"
      >
        Y: {yPosition}
      </Text>
    );

    return labels;
  };

  // Create three layers at different Y positions
  const yPositions = [0, 50, 100];
  const gridLayers = yPositions.map(y => (
    <group key={`layer${y}`}>
      <primitive object={new THREE.GridHelper(size, divisions, 0xffffff, 0x333333)} position={[0, y, 0]} />
      <points>
        <bufferGeometry attach="geometry" {...createGridLayer(y)} />
        <pointsMaterial
          attach="material"
          size={2}
          sizeAttenuation={false}
          color={0xffffff}
          transparent
          opacity={0.5}
        />
      </points>
      {createLabels(y)}
    </group>
  ));

  return <group>{gridLayers}</group>;
};

export default Grid;
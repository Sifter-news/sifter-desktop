import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const DebugAxes = () => {
  // Create line geometries for each axis
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = {
    x: new THREE.LineBasicMaterial({ color: 'red' }),
    y: new THREE.LineBasicMaterial({ color: 'green' }),
    z: new THREE.LineBasicMaterial({ color: 'blue' })
  };

  // Create vertices for each axis line
  const xLineVertices = new Float32Array([0, 0, 0, 5000, 0, 0]);
  const yLineVertices = new Float32Array([0, 0, 0, 0, 5000, 0]);
  const zLineVertices = new Float32Array([0, 0, 0, 0, 0, 5000]);

  return (
    <>
      {/* X axis line and label */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={xLineVertices}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="red" />
      </line>
      <Text
        position={[8, 0, 0]}
        color="red"
        fontSize={8}
        anchorX="left"
        anchorY="middle"
      >
        X
      </Text>
      
      {/* Y axis line and label */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={yLineVertices}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="green" />
      </line>
      <Text
        position={[0, 8, 0]}
        color="green"
        fontSize={8}
        anchorX="left"
        anchorY="middle"
      >
        Y
      </Text>
      
      {/* Z axis line and label */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={zLineVertices}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="blue" />
      </line>
      <Text
        position={[0, 0, 8]}
        color="blue"
        fontSize={8}
        anchorX="left"
        anchorY="middle"
      >
        Z
      </Text>
    </>
  );
};

export default DebugAxes;
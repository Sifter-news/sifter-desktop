import React from 'react';
import * as THREE from 'three';

const testData = [
  { id: 1, position: [-20, 0, -20], connections: [2, 3] },
  { id: 2, position: [0, 0, 0], connections: [3] },
  { id: 3, position: [20, 0, 20], connections: [] },
];

const TestNodes = () => {
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = [];

  // Create connections between nodes
  testData.forEach(node => {
    node.connections.forEach(targetId => {
      const target = testData.find(n => n.id === targetId);
      if (target) {
        linePositions.push(...node.position);
        linePositions.push(...target.position);
      }
    });
  });

  lineGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(linePositions, 3)
  );

  return (
    <group>
      {/* Render nodes */}
      {testData.map(node => (
        <mesh key={node.id} position={node.position}>
          <boxGeometry args={[5, 5, 5]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}

      {/* Render connections */}
      <line>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial attach="material" color="white" opacity={0.5} transparent />
      </line>
    </group>
  );
};

export default TestNodes;
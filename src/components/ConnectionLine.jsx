import React from 'react';
import * as THREE from 'three';

const ConnectionLine = ({ start, end }) => {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#ffffff" linewidth={2} />
    </line>
  );
};

export default ConnectionLine;
import React from 'react';
import * as THREE from 'three';

const ConnectionLine = ({ start, end }) => {
  // Early return if start or end positions are not valid arrays
  if (!Array.isArray(start) || !Array.isArray(end) || start.length < 3 || end.length < 3) {
    return null;
  }

  const points = [
    new THREE.Vector3(start[0], start[1], start[2]),
    new THREE.Vector3(end[0], end[1], end[2]),
  ];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#ffffff" linewidth={2} />
    </line>
  );
};

export default ConnectionLine;
import React from 'react';
import * as THREE from 'three';

const RotationIndicator = ({ axis, color }) => {
  const curve = new THREE.EllipseCurve(
    0, 0,             // Center x, y
    5, 5,             // X and Y radius
    0, 2 * Math.PI,   // Start and end angle
    false,            // Clockwise
    0                 // Rotation
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // Transform the circle based on which axis it represents
  const position = [0, 0, 0];
  const rotation = [0, 0, 0];
  
  if (axis === 'x') {
    rotation[1] = Math.PI / 2;
  } else if (axis === 'y') {
    rotation[0] = Math.PI / 2;
  }

  return (
    <line rotation={rotation} position={position}>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color={color} />
    </line>
  );
};

export default RotationIndicator;
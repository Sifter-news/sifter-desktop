import React from 'react';
import * as THREE from 'three';

const AxisLine = ({ vertices, color, opacity = 1 }) => {
  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          count={2}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        attach="material" 
        color={color} 
        transparent={opacity < 1}
        opacity={opacity}
      />
    </line>
  );
};

export default AxisLine;
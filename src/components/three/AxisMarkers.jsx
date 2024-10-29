import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const AxisMarkers = ({ axis, color, fadedColor }) => {
  const markers = [];
  const axisLetter = axis.toUpperCase();
  
  // Positive markers
  for (let i = 8; i <= 5000; i += 8) {
    const position = axis === 'x' ? [i, 0, 0] 
                  : axis === 'y' ? [0, i, 0]
                  : [0, 0, i];
    
    markers.push(
      <Text
        key={`${axis}-${i}`}
        position={position}
        color={color}
        fontSize={1}
        anchorX="left"
        anchorY="middle"
      >
        {`${i}${axisLetter}`}
      </Text>
    );

    const markerVertices = new Float32Array([
      ...position,
      ...(axis === 'x' ? [i, 2, 0] : axis === 'y' ? [2, i, 0] : [0, 2, i])
    ]);

    markers.push(
      <line key={`${axis}-line-${i}`}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={markerVertices}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={color} />
      </line>
    );
  }

  // Negative markers
  for (let i = -8; i >= -5000; i -= 8) {
    const position = axis === 'x' ? [i, 0, 0] 
                  : axis === 'y' ? [0, i, 0]
                  : [0, 0, i];
    
    markers.push(
      <Text
        key={`${axis}-${i}`}
        position={position}
        color={fadedColor}
        fontSize={1}
        anchorX="left"
        anchorY="middle"
      >
        {`${i}${axisLetter}`}
      </Text>
    );

    const markerVertices = new Float32Array([
      ...position,
      ...(axis === 'x' ? [i, 2, 0] : axis === 'y' ? [2, i, 0] : [0, 2, i])
    ]);

    markers.push(
      <line key={`${axis}-line-${i}`}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={markerVertices}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          attach="material" 
          color={fadedColor}
          transparent
          opacity={0.5}
        />
      </line>
    );
  }

  return <>{markers}</>;
};

export default AxisMarkers;
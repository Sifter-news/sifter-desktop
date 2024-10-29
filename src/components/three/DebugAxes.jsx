import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const DebugAxes = () => {
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = {
    x: new THREE.LineBasicMaterial({ color: 'red' }),
    y: new THREE.LineBasicMaterial({ color: 'green' }),
    z: new THREE.LineBasicMaterial({ color: 'blue' })
  };

  const xLineVertices = new Float32Array([0, 0, 0, 5000, 0, 0]);
  const yLineVertices = new Float32Array([0, 0, 0, 0, 5000, 0]);
  const zLineVertices = new Float32Array([0, 0, 0, 0, 0, 5000]);

  // Generate markers every 8 units
  const generateMarkers = (axis) => {
    const markers = [];
    for (let i = 8; i <= 5000; i += 8) {
      // Create marker position based on axis
      const position = axis === 'x' ? [i, 0, 0] 
                    : axis === 'y' ? [0, i, 0]
                    : [0, 0, i];
      
      // Add marker text with reduced size
      markers.push(
        <Text
          key={`${axis}-${i}`}
          position={position}
          color={axis === 'x' ? 'red' : axis === 'y' ? 'green' : 'blue'}
          fontSize={1} // Reduced from 4 to 1 (75% reduction)
          anchorX="left"
          anchorY="middle"
        >
          {`${i}`}
        </Text>
      );

      // Add small line marker
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
            color={axis === 'x' ? 'red' : axis === 'y' ? 'green' : 'blue'} 
          />
        </line>
      );
    }
    return markers;
  };

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
        fontSize={2} // Reduced from 8 to 2 (75% reduction)
        anchorX="left"
        anchorY="middle"
      >
        X
      </Text>
      {generateMarkers('x')}
      
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
        fontSize={2} // Reduced from 8 to 2 (75% reduction)
        anchorX="left"
        anchorY="middle"
      >
        Y
      </Text>
      {generateMarkers('y')}
      
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
        fontSize={2} // Reduced from 8 to 2 (75% reduction)
        anchorX="left"
        anchorY="middle"
      >
        Z
      </Text>
      {generateMarkers('z')}
    </>
  );
};

export default DebugAxes;
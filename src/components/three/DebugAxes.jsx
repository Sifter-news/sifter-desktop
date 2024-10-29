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

  // Positive axis lines
  const xLineVertices = new Float32Array([0, 0, 0, 5000, 0, 0]);
  const yLineVertices = new Float32Array([0, 0, 0, 0, 5000, 0]);
  const zLineVertices = new Float32Array([0, 0, 0, 0, 0, 5000]);

  // Negative axis lines (faded)
  const negXLineVertices = new Float32Array([0, 0, 0, -5000, 0, 0]);
  const negYLineVertices = new Float32Array([0, 0, 0, 0, -5000, 0]);
  const negZLineVertices = new Float32Array([0, 0, 0, 0, 0, -5000]);

  // Generate markers for both positive and negative values
  const generateMarkers = (axis) => {
    const markers = [];
    
    // Positive markers
    for (let i = 8; i <= 5000; i += 8) {
      const position = axis === 'x' ? [i, 0, 0] 
                    : axis === 'y' ? [0, i, 0]
                    : [0, 0, i];
      
      markers.push(
        <Text
          key={`${axis}-${i}`}
          position={position}
          color={axis === 'x' ? 'red' : axis === 'y' ? 'green' : 'blue'}
          fontSize={1}
          anchorX="left"
          anchorY="middle"
        >
          {`${i}`}
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
          <lineBasicMaterial attach="material" color={axis === 'x' ? 'red' : axis === 'y' ? 'green' : 'blue'} />
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
          color={axis === 'x' ? '#ff000080' : axis === 'y' ? '#00ff0080' : '#0000ff80'}
          fontSize={1}
          anchorX="left"
          anchorY="middle"
        >
          {`${i}`}
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
            color={axis === 'x' ? '#ff000080' : axis === 'y' ? '#00ff0080' : '#0000ff80'} 
            transparent
            opacity={0.5}
          />
        </line>
      );
    }
    return markers;
  };

  return (
    <>
      {/* Positive X axis */}
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
      
      {/* Negative X axis (faded) */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={negXLineVertices}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#ff000080" transparent opacity={0.5} />
      </line>

      <Text position={[8, 0, 0]} color="red" fontSize={2} anchorX="left" anchorY="middle">X</Text>
      {generateMarkers('x')}
      
      {/* Positive Y axis */}
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

      {/* Negative Y axis (faded) */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={negYLineVertices}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#00ff0080" transparent opacity={0.5} />
      </line>

      <Text position={[0, 8, 0]} color="green" fontSize={2} anchorX="left" anchorY="middle">Y</Text>
      {generateMarkers('y')}
      
      {/* Positive Z axis */}
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

      {/* Negative Z axis (faded) */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={negZLineVertices}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#0000ff80" transparent opacity={0.5} />
      </line>

      <Text position={[0, 0, 8]} color="blue" fontSize={2} anchorX="left" anchorY="middle">Z</Text>
      {generateMarkers('z')}
    </>
  );
};

export default DebugAxes;
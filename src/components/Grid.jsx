import React from 'react';
import * as THREE from 'three';

const GridLayer = ({ z = 0, opacity = 0.3, divisions = 250, spacing = 16 }) => {
  const size = spacing * divisions; // Total size will be 4000 units (16 * 250)
  
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.position.z = z;
  gridHelper.rotation.x = Math.PI / 2; // Rotate to make it vertical on Z axis
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = opacity;
  
  if (gridHelper.material instanceof THREE.LineBasicMaterial) {
    const centerLineMaterial = gridHelper.material.clone();
    centerLineMaterial.opacity = opacity;
    gridHelper.material = [centerLineMaterial, gridHelper.material];
  }

  const dotGeometry = new THREE.BufferGeometry();
  const positions = [];
  const halfSize = size / 2;

  // Use 8px spacing for z=0, 16px for other layers
  const dotSpacing = z === 0 ? 8 : 16;

  for (let i = -halfSize; i <= halfSize; i += dotSpacing) {
    for (let j = -halfSize; j <= halfSize; j += dotSpacing) {
      positions.push(i, j, z);
    }
  }

  dotGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );

  return (
    <group>
      <primitive object={gridHelper} />
      <points>
        <bufferGeometry attach="geometry" {...dotGeometry} />
        <pointsMaterial
          attach="material"
          size={2}
          sizeAttenuation={false}
          color={0xffffff}
          transparent
          opacity={opacity}
        />
      </points>
    </group>
  );
};

const CubeOutline = () => {
  const size = 12.8; // 256px / 20 (our standard scale factor)
  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
  
  return (
    <group position={[0, 0, size/2]}>
      {/* Wireframe outline */}
      <lineSegments>
        <primitive object={edges} />
        <lineBasicMaterial color="white" opacity={0.5} transparent />
      </lineSegments>
      
      {/* Solid front face */}
      <mesh position={[0, 0, size/2]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial color="white" opacity={0.9} transparent />
      </mesh>
    </group>
  );
};

const Grid = ({ divisions = 250 }) => {
  // Create grid layers with 24px increments, including positive z
  const gridPositions = [
    48, 24, // Positive z layers
    0,      // Base layer
    -24, -48 // Negative z layers
  ];
  const baseOpacity = 0.45; // Increased from 0.3 to 0.45
  
  return (
    <group>
      {gridPositions.map((zPos, index) => (
        <GridLayer 
          key={`grid-${index}`}
          z={zPos} 
          opacity={zPos === 0 ? baseOpacity : 0.1} // Base layer at 45% opacity, rest at 10%
          divisions={divisions} 
        />
      ))}
      <CubeOutline />
    </group>
  );
};

export default Grid;

import React from 'react';
import { Text } from '@react-three/drei';

const DebugAxes = () => {
  return (
    <>
      {/* X axis label (red) */}
      <Text
        position={[8, 0, 0]}
        color="red"
        fontSize={8}
        anchorX="left"
        anchorY="middle"
      >
        X
      </Text>
      
      {/* Y axis label (green) */}
      <Text
        position={[0, 8, 0]}
        color="green"
        fontSize={8}
        anchorX="left"
        anchorY="middle"
      >
        Y
      </Text>
      
      {/* Z axis label (blue) */}
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
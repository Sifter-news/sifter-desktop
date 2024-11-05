import React from 'react';
import { Text } from '@react-three/drei';

const Canvas3DCompactNode = ({ node, position, isHighlighted, onSelect }) => {
  return (
    <mesh position={position} onClick={onSelect}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color={isHighlighted ? "#4a9eff" : "#2d2d2d"} />
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.title}
      </Text>
    </mesh>
  );
};

export default Canvas3DCompactNode;
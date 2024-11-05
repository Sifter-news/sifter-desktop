import React from 'react';
import { Text } from '@react-three/drei';

const Canvas3DDefaultNode = ({ node, position, isHighlighted, onSelect }) => {
  return (
    <mesh position={position} onClick={onSelect}>
      <boxGeometry args={[2, 1, 0.1]} />
      <meshStandardMaterial color={isHighlighted ? "#4a9eff" : "#ffffff"} />
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.15}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {node.title}
      </Text>
    </mesh>
  );
};

export default Canvas3DDefaultNode;
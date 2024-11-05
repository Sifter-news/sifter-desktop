import React from 'react';
import { Text } from '@react-three/drei';

const Canvas3DPostitNode = ({ node, position, isHighlighted, onSelect }) => {
  return (
    <mesh position={position} onClick={onSelect}>
      <boxGeometry args={[1.5, 1.5, 0.1]} />
      <meshStandardMaterial color={isHighlighted ? "#ffeb3b" : "#fff176"} />
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.12}
        color="black"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
      >
        {node.title}
      </Text>
    </mesh>
  );
};

export default Canvas3DPostitNode;
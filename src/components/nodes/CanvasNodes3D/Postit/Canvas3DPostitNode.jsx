import React, { useRef } from 'react';
import { Billboard, Text } from '@react-three/drei';
import NodeBase from '../../NodeBase';
import { getNodeDimensions3D, createNodeMaterial } from '../../../../utils/threeDUtils';

const Canvas3DPostitNode = ({ 
  node,
  activeTool,
  onSelect,
  isHighlighted,
  position = [0, 0, 0]
}) => {
  const meshRef = useRef();
  const baseProps = NodeBase(node);
  const dimensions = getNodeDimensions3D(baseProps.visualStyle);

  return (
    <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
      <group position={position}>
        <mesh ref={meshRef} onClick={(e) => {
          if (activeTool === 'select') {
            e.stopPropagation();
            onSelect?.();
          }
        }}>
          <planeGeometry args={[dimensions.width, dimensions.height]} />
          <primitive object={createNodeMaterial(false, isHighlighted, 'postit')} />
        </mesh>
        
        <Text
          position={[0, dimensions.height/4, 0.1]}
          fontSize={0.8}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={dimensions.width * 0.8}
        >
          {baseProps.title}
        </Text>
        
        <Text
          position={[0, -dimensions.height/4, 0.1]}
          fontSize={0.4}
          color="gray"
          anchorX="center"
          anchorY="middle"
          maxWidth={dimensions.width * 0.8}
        >
          {baseProps.description}
        </Text>
      </group>
    </Billboard>
  );
};

export default Canvas3DPostitNode;
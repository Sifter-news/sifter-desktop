import React, { useRef } from 'react';
import { Billboard } from '@react-three/drei';
import NodeBase from '../../NodeBase';
import { getNodeDimensions3D, createNodeMaterial } from '../../../../utils/threeDUtils';

const Canvas3DCompactNode = ({ 
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
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          if (activeTool === 'select') {
            e.stopPropagation();
            onSelect?.();
          }
        }}
      >
        <circleGeometry args={[dimensions.width / 2, 32]} />
        <primitive object={createNodeMaterial(false, isHighlighted, 'compact')} />
      </mesh>
    </Billboard>
  );
};

export default Canvas3DCompactNode;
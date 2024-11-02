import React from 'react';
import { useThree } from '@react-three/fiber';
import Canvas3DDefaultNode from '@/components/nodes/CanvasNodes3D/Default/Canvas3DDefaultNode';

const ThreeScene = ({ 
  nodes, 
  viewMode, 
  activeTool, 
  controlsRef, 
  handleNodeUpdate,
  zoom 
}) => {
  const { camera } = useThree();

  return (
    <group>
      {nodes.map((node) => (
        <Canvas3DDefaultNode
          key={node.id}
          node={node}
          activeTool={activeTool}
          position={node.position}
          onSelect={() => {
            if (activeTool === 'select') {
              handleNodeUpdate(node.id, node.position);
            }
          }}
        />
      ))}
    </group>
  );
};

export default ThreeScene;
import React from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './NodeContent';
import { getNodeDimensions } from '@/utils/nodeStyles';

const TwoDNode = ({ 
  node, 
  zoom,
  onNodeUpdate,
  onFocus,
  isFocused,
  onDelete,
  isDraggable = true,
  position = { x: 0, y: 0 }
}) => {
  const dimensions = getNodeDimensions(node.visualStyle || 'default');

  const handleDragStop = (e, d) => {
    if (onNodeUpdate) {
      onNodeUpdate(node.id, {
        x: d.x,
        y: d.y
      });
    }
  };

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={position}
      onDragStop={handleDragStop}
      disableDragging={!isDraggable}
      scale={zoom}
      className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' : ''
      }`}
      bounds="parent"
    >
      <div onClick={() => onFocus?.(node.id)}>
        <NodeContent
          style={node.visualStyle}
          node={node}
          isFocused={isFocused}
        />
      </div>
    </Rnd>
  );
};

export default TwoDNode;
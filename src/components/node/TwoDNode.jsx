import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './NodeContent';
import NodeTooltip from './NodeTooltip';
import { getNodeDimensions } from '@/utils/nodeStyles';

const TwoDNode = ({ 
  node, 
  zoom = 1,
  onNodeUpdate,
  onFocus,
  isFocused,
  onDelete,
  onAIConversation,
  isDraggable = true,
  position = { x: 0, y: 0 }
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const dimensions = getNodeDimensions(node.visualStyle || 'default');

  const handleDragStop = (e, d) => {
    if (onNodeUpdate) {
      onNodeUpdate(node.id, {
        x: d.x,
        y: d.y
      });
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus?.(node.id);
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
      <div onClick={handleClick}>
        <NodeContent
          style={node.visualStyle}
          node={node}
          isFocused={isFocused}
        />
        {showTooltip && (
          <NodeTooltip
            node={node}
            showTooltip={showTooltip}
            onAIConversation={onAIConversation}
            onDelete={onDelete}
            onUpdateNode={onNodeUpdate}
          />
        )}
      </div>
    </Rnd>
  );
};

export default TwoDNode;
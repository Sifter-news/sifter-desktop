import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './NodeContent';
import ConnectionDot from './ConnectionDot';

const TwoDNode = ({ 
  node, 
  zoom,
  onNodeUpdate,
  onFocus,
  isFocused,
  onDelete,
  isDraggable = true,
  position = { x: 0, y: 0 },
  onStartConnection,
  onEndConnection
}) => {
  const dimensions = getNodeDimensions(node.visualStyle || 'default');
  const [hoveredConnection, setHoveredConnection] = useState(null);

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
      className={`relative transition-all duration-200 group ${
        isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' : ''
      }`}
      bounds="parent"
    >
      <div onClick={() => onFocus?.(node.id)} className="relative">
        <NodeContent
          style={node.visualStyle}
          node={node}
          isFocused={isFocused}
        />
        
        <ConnectionDot 
          position="top"
          isHovered={hoveredConnection === 'top'}
          onHover={() => setHoveredConnection('top')}
          onLeaveHover={() => setHoveredConnection(null)}
          onStartConnection={onStartConnection}
          nodeId={node.id}
        />
        <ConnectionDot 
          position="right"
          isHovered={hoveredConnection === 'right'}
          onHover={() => setHoveredConnection('right')}
          onLeaveHover={() => setHoveredConnection(null)}
          onStartConnection={onStartConnection}
          nodeId={node.id}
        />
        <ConnectionDot 
          position="bottom"
          isHovered={hoveredConnection === 'bottom'}
          onHover={() => setHoveredConnection('bottom')}
          onLeaveHover={() => setHoveredConnection(null)}
          onStartConnection={onStartConnection}
          nodeId={node.id}
        />
        <ConnectionDot 
          position="left"
          isHovered={hoveredConnection === 'left'}
          onHover={() => setHoveredConnection('left')}
          onLeaveHover={() => setHoveredConnection(null)}
          onStartConnection={onStartConnection}
          nodeId={node.id}
        />
      </div>
    </Rnd>
  );
};

export default TwoDNode;
import React from 'react';
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
  onEndConnection,
  dimensions,
  onDragStart
}) => {
  const handleDragStart = (e, d) => {
    if (onDragStart) {
      onDragStart(node.id, e);
    }
  };

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
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      disableDragging={!isDraggable}
      scale={zoom}
      className={`relative transition-all duration-200 group ${
        isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' : ''
      }`}
      bounds="parent"
    >
      <div onClick={() => onFocus?.(node.id)} className="relative w-full h-full">
        <NodeContent
          style={node.visualStyle}
          node={node}
          isFocused={isFocused}
          dimensions={dimensions}
        />
        
        <ConnectionDot 
          position="top"
          onStartConnection={onStartConnection}
          onEndConnection={onEndConnection}
          nodeId={node.id}
        />
        <ConnectionDot 
          position="right"
          onStartConnection={onStartConnection}
          onEndConnection={onEndConnection}
          nodeId={node.id}
        />
        <ConnectionDot 
          position="bottom"
          onStartConnection={onStartConnection}
          onEndConnection={onEndConnection}
          nodeId={node.id}
        />
        <ConnectionDot 
          position="left"
          onStartConnection={onStartConnection}
          onEndConnection={onEndConnection}
          nodeId={node.id}
        />
      </div>
    </Rnd>
  );
};

export default TwoDNode;
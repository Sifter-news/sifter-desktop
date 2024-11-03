import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './NodeContent';
import ConnectionDot from './ConnectionDot';
import NodeStyleTooltip from './NodeStyleTooltip';

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
  onDragStart,
  onAIConversation
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [textSize, setTextSize] = useState(node.textSize || 'medium');
  const [textAlign, setTextAlign] = useState(node.textAlign || 'left');
  const [color, setColor] = useState(node.color || 'bg-white');

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

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus?.(node.id);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    onNodeUpdate(node.id, { color: newColor });
  };

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={position}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      disableDragging={!isDraggable}
      scale={zoom}
      className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' : ''
      }`}
      onClick={handleNodeClick}
      bounds="parent"
    >
      {showTooltip && isFocused && (
        <NodeStyleTooltip
          position={position}
          onStyleChange={(style) => {
            const newDimensions = dimensions;
            onNodeUpdate(node.id, { 
              visualStyle: style,
              width: newDimensions.width,
              height: newDimensions.height
            });
          }}
          onTextSizeChange={(size) => {
            setTextSize(size);
            onNodeUpdate(node.id, { textSize: size });
          }}
          onAlignmentChange={(align) => {
            setTextAlign(align);
            onNodeUpdate(node.id, { textAlign: align });
          }}
          onTypeChange={(type) => onNodeUpdate(node.id, { nodeType: type })}
          onColorChange={handleColorChange}
          onAIChat={() => onAIConversation?.(node)}
        />
      )}

      <div onClick={handleNodeClick} className="relative w-full h-full">
        <NodeContent
          style={node.visualStyle}
          node={node}
          isFocused={isFocused}
          dimensions={dimensions}
          textSize={textSize}
          textAlign={textAlign}
          color={color}
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
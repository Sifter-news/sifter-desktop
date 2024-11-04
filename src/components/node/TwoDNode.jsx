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
  onDotClick,
  dimensions,
  onDragStart,
  onAIConversation
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [textSize, setTextSize] = useState(node.textSize || 'medium');
  const [textAlign, setTextAlign] = useState(node.textAlign || 'left');
  const [color, setColor] = useState(node.color || 'bg-white');
  const [hoveredDot, setHoveredDot] = useState(null);

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

  const connectionPoints = ['left', 'right', 'top', 'bottom'];

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={position}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      scale={zoom}
      className={`group relative transition-all duration-200 bg-white ${
        isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' : ''
      }`}
      onClick={handleNodeClick}
      bounds="parent"
      enableResizing={false}
      disableDragging={!isDraggable}
    >
      <div className="relative w-full h-full bg-white rounded-lg">
        <NodeContent
          style={node.visualStyle}
          node={node}
          isFocused={isFocused}
          dimensions={dimensions}
          textSize={textSize}
          textAlign={textAlign}
          color={color}
        />
        
        {connectionPoints.map((position) => (
          <ConnectionDot 
            key={position}
            position={position}
            isHovered={hoveredDot === position}
            onHover={() => setHoveredDot(position)}
            onLeaveHover={() => setHoveredDot(null)}
            onDotClick={(nodeId, pos) => {
              const rect = document.querySelector(`[data-node-id="${nodeId}"]`)?.getBoundingClientRect();
              if (rect) {
                onDotClick(nodeId, pos, {
                  x: rect.left + rect.width/2,
                  y: rect.top + rect.height/2
                });
              }
            }}
            nodeId={node.id}
          />
        ))}
      </div>

      {showTooltip && isFocused && (
        <NodeStyleTooltip
          position={position}
          onStyleChange={(style) => {
            onNodeUpdate(node.id, { 
              visualStyle: style,
              width: dimensions.width,
              height: dimensions.height
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
          onColorChange={handleColorChange}
          onAIChat={() => onAIConversation?.(node)}
        />
      )}
    </Rnd>
  );
};

export default TwoDNode;
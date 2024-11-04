import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './NodeContent';
import ConnectionDot from './ConnectionDot';
import NodeStyleTooltip from '@/01_components/06_nodes/tooltips/NodeTooltip';

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
  onAIConversation,
  showTooltip = false // Add this prop
}) => {
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

  const handleResize = (e, direction, ref, delta, position) => {
    onNodeUpdate(node.id, {
      width: ref.style.width,
      height: ref.style.height,
      x: position.x,
      y: position.y
    });
  };

  const handleNodeClick = (e) => {
    e.stopPropagation();
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
      onResize={handleResize}
      disableDragging={!isDraggable}
      scale={zoom}
      className={`group relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' : ''
      }`}
      onClick={handleNodeClick}
      bounds="parent"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true
      }}
    >
      {showTooltip && (
        <NodeStyleTooltip
          node={node}
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
          onDelete={() => onDelete?.(node.id)}
        />
      )}

      <div className="relative w-full h-full">
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
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            nodeId={node.id}
          />
        ))}
      </div>
    </Rnd>
  );
};

export default TwoDNode;
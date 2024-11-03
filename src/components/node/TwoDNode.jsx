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
  const [color, setColor] = useState(node.color || 'bg-white'); // Set default color to white
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
    setShowTooltip(true);
    onFocus?.(node.id);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    onNodeUpdate(node.id, { color: newColor });
  };

  const connectionPoints = [
    'top-left', 'top-center', 'top-right',
    'middle-left', 'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

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
      resizeHandleClasses={{
        top: 'border-t-2 border-blue-500 cursor-ns-resize opacity-0 group-hover:opacity-100',
        right: 'border-r-2 border-blue-500 cursor-ew-resize opacity-0 group-hover:opacity-100',
        bottom: 'border-b-2 border-blue-500 cursor-ns-resize opacity-0 group-hover:opacity-100',
        left: 'border-l-2 border-blue-500 cursor-ew-resize opacity-0 group-hover:opacity-100',
        topRight: 'w-3 h-3 border-2 border-blue-500 bg-white rounded-sm cursor-ne-resize opacity-0 group-hover:opacity-100',
        bottomRight: 'w-3 h-3 border-2 border-blue-500 bg-white rounded-sm cursor-se-resize opacity-0 group-hover:opacity-100',
        bottomLeft: 'w-3 h-3 border-2 border-blue-500 bg-white rounded-sm cursor-sw-resize opacity-0 group-hover:opacity-100',
        topLeft: 'w-3 h-3 border-2 border-blue-500 bg-white rounded-sm cursor-nw-resize opacity-0 group-hover:opacity-100'
      }}
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

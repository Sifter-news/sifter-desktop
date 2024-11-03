import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { GripVertical } from 'lucide-react';
import NodeContent from './node/NodeContent';
import NodeStyleTooltip from './node/NodeStyleTooltip';
import { isColliding, findNonCollidingPosition } from '@/utils/collisionUtils';
import { snapToGrid, snapToSingleAxis } from '@/utils/canvasUtils';
import { getNodeDimensions } from '@/utils/nodeStyles';

const NodeRenderer = ({ 
  node, 
  onDragStart, 
  onDrag,
  onDragEnd,
  zoom, 
  onNodeUpdate, 
  onFocus, 
  isFocused, 
  onAIConversation, 
  onDelete,
  isDragging,
  allNodes 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: node.x || 0, y: node.y || 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [textSize, setTextSize] = useState(node.textSize || 'medium');
  const [textAlign, setTextAlign] = useState(node.textAlign || 'left');
  const [nodeColor, setNodeColor] = useState(node.color || 'white');
  const dragStartPos = useRef(null);
  const lastPosition = useRef(position);

  const dimensions = getNodeDimensions(node?.visualStyle || 'default');

  useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  useEffect(() => {
    // Update position when node coordinates change
    setPosition({ x: node.x || 0, y: node.y || 0 });
  }, [node.x, node.y]);

  const handleDragStart = (e, d) => {
    dragStartPos.current = { x: d.x, y: d.y };
    lastPosition.current = { x: d.x, y: d.y };
    onDragStart?.(e, d);
  };

  const handleDrag = (e, d) => {
    if (!dragStartPos.current) return;
    
    const snappedPosition = snapToSingleAxis(dragStartPos.current, { x: d.x, y: d.y });
    
    // Apply smooth interpolation between last position and new position
    const interpolatedPosition = {
      x: lastPosition.current.x + (snappedPosition.x - lastPosition.current.x) * 0.5,
      y: lastPosition.current.y + (snappedPosition.y - lastPosition.current.y) * 0.5
    };
    
    lastPosition.current = interpolatedPosition;
    setPosition(interpolatedPosition);
    onDrag?.(e, { ...d, ...interpolatedPosition });
  };

  const handleDragStop = (e, d) => {
    if (!dragStartPos.current) return;
    
    const snappedPosition = snapToSingleAxis(dragStartPos.current, { x: d.x, y: d.y });
    const otherNodes = allNodes.filter(n => n.id !== node.id);
    const finalPosition = findNonCollidingPosition(
      { ...node, ...snappedPosition },
      otherNodes
    );
    
    setPosition(finalPosition);
    dragStartPos.current = null;
    lastPosition.current = finalPosition;
    onDragEnd?.(e, { ...d, ...finalPosition });
  };

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus(node.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription,
      textSize,
      textAlign,
      color: nodeColor
    });
  };

  return (
    <div 
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Rnd
        size={{ width: dimensions.width, height: dimensions.height }}
        position={position}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        scale={zoom}
        className={`relative transition-all duration-200 ease-out transform ${
          isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' : 
          isHovered ? 'ring-1 ring-blue-300 ring-offset-1 shadow-md scale-[1.01]' : ''
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onClick={handleNodeClick}
        enableResizing={dimensions.resizable}
        bounds="parent"
        dragHandleClassName="drag-handle"
      >
        {isHovered && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white/90 rounded-t-md px-2 py-1 cursor-grab active:cursor-grabbing drag-handle">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        )}
        
        {showTooltip && (
          <NodeStyleTooltip
            position={position}
            onStyleChange={(style) => {
              const newDimensions = getNodeDimensions(style);
              onNodeUpdate(node.id, { 
                visualStyle: style,
                width: newDimensions.width,
                height: newDimensions.height
              });
            }}
            onTextSizeChange={setTextSize}
            onAlignmentChange={setTextAlign}
            onTypeChange={(type) => onNodeUpdate(node.id, { nodeType: type })}
            onColorChange={setNodeColor}
            onEdit={() => setIsEditing(true)}
            onAIChat={() => onAIConversation(node)}
          />
        )}
        
        <NodeContent
          style={node.visualStyle}
          isEditing={isEditing}
          node={node}
          localTitle={localTitle}
          localDescription={localDescription}
          handleBlur={handleBlur}
          setLocalTitle={setLocalTitle}
          setLocalDescription={setLocalDescription}
          isFocused={isFocused}
          textSize={textSize}
          textAlign={textAlign}
          color={nodeColor}
          dimensions={dimensions}
        />
      </Rnd>
    </div>
  );
};

export default NodeRenderer;
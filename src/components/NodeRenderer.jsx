import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './node/NodeContent';
import NodeStyleTooltip from './node/NodeStyleTooltip';
import { isColliding, findNonCollidingPosition } from '@/utils/collisionUtils';
import { snapToGrid, snapToSingleAxis } from '@/utils/canvasUtils';

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
  const [position, setPosition] = useState({ x: node.x, y: node.y });
  const [textSize, setTextSize] = useState(node.textSize || 'medium');
  const [textAlign, setTextAlign] = useState(node.textAlign || 'left');
  const [nodeColor, setNodeColor] = useState(node.color || 'white');
  const dragStartPos = useRef(null);

  useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  const handleDragStart = (e, d) => {
    dragStartPos.current = { x: d.x, y: d.y };
    onDragStart?.(e, d);
  };

  const handleDrag = (e, d) => {
    if (!dragStartPos.current) return;
    
    const snappedPosition = snapToSingleAxis(dragStartPos.current, { x: d.x, y: d.y });
    setPosition(snappedPosition);
    onDrag?.(e, { ...d, ...snappedPosition });
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

  const handleStyleChange = (style) => {
    onNodeUpdate(node.id, { visualStyle: style });
  };

  const handleTextSizeChange = (size) => {
    setTextSize(size);
    onNodeUpdate(node.id, { textSize: size });
  };

  const handleAlignmentChange = (align) => {
    setTextAlign(align);
    onNodeUpdate(node.id, { textAlign: align });
  };

  const handleColorChange = (color) => {
    setNodeColor(color);
    onNodeUpdate(node.id, { color });
  };

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width || 200, height: node.height || 100 }}
        position={position}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        scale={zoom}
        className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onClick={handleNodeClick}
        enableResizing={false}
        bounds="parent"
      >
        {showTooltip && (
          <NodeStyleTooltip
            position={position}
            onStyleChange={handleStyleChange}
            onTextSizeChange={handleTextSizeChange}
            onAlignmentChange={handleAlignmentChange}
            onTypeChange={(type) => onNodeUpdate(node.id, { nodeType: type })}
            onColorChange={handleColorChange}
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
        />
      </Rnd>
    </div>
  );
};

export default NodeRenderer;
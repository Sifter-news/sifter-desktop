import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './NodeContent';
import NodeTooltip from './NodeTooltip';
import { isColliding, findNonCollidingPosition } from '@/utils/collisionUtils';

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

  useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus(node.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription
    });
  };

  const handleDragStop = (e, d) => {
    const otherNodes = allNodes.filter(n => n.id !== node.id);
    const newPosition = findNonCollidingPosition(
      { ...node, x: d.x, y: d.y },
      otherNodes
    );
    
    setPosition(newPosition);
    onDragEnd?.(e, { ...d, x: newPosition.x, y: newPosition.y });
  };

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width || 200, height: node.height || 100 }}
        position={position}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragStop={handleDragStop}
        scale={zoom}
        className={`relative ${
          isFocused 
            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' 
            : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1 hover:shadow-md hover:scale-[1.01]'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onClick={handleNodeClick}
        enableResizing={false}
        bounds="parent"
      >
        <NodeContent
          style={node.visualStyle}
          isEditing={isEditing}
          node={node}
          localTitle={localTitle}
          localDescription={localDescription}
          handleBlur={handleBlur}
          setLocalTitle={setLocalTitle}
          setLocalDescription={setLocalDescription}
          handleNodeClick={handleNodeClick}
          isFocused={isFocused}
        />
        <NodeTooltip
          node={node}
          showTooltip={showTooltip}
          onAIConversation={onAIConversation}
          onDelete={onDelete}
          onUpdateNode={onNodeUpdate}
        />
      </Rnd>
    </div>
  );
};

export default NodeRenderer;
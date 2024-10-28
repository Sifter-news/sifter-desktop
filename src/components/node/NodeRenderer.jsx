import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './NodeContent';
import NodeTooltip from './NodeTooltip';

const NodeRenderer = ({ 
  node, 
  zoom, 
  onNodeUpdate, 
  onFocus, 
  isFocused, 
  onAIConversation, 
  onDelete,
  onNodePositionUpdate,
  isDraggable
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

  // Only update local position when node props change significantly
  useEffect(() => {
    if (Math.abs(node.x - position.x) > 1 || Math.abs(node.y - position.y) > 1) {
      setPosition({ x: node.x, y: node.y });
    }
  }, [node.x, node.y]);

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
    const newPosition = { x: d.x, y: d.y };
    setPosition(newPosition);
    // Ensure we update the parent component with the new position
    onNodePositionUpdate(node.id, newPosition.x, newPosition.y);
  };

  return (
    <Rnd
      size={{ width: node.width, height: node.height }}
      position={position}
      scale={zoom}
      onDragStop={handleDragStop}
      className={`${
        isFocused 
          ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' 
          : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1 hover:shadow-md hover:scale-[1.01]'
      } transition-all duration-200`}
      onClick={handleNodeClick}
      enableResizing={false}
      disableDragging={!isDraggable}
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
  );
};

export default NodeRenderer;
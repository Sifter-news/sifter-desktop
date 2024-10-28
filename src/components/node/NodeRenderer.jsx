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
  const [position, setPosition] = useState({ x: node.x || 0, y: node.y || 0 });

  useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  useEffect(() => {
    // Update local position when node position changes
    if (node.x !== undefined && node.y !== undefined) {
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
    // Ensure we're passing the node ID and new position to the update handler
    onNodePositionUpdate(node.id, newPosition.x, newPosition.y);
  };

  return (
    <Rnd
      position={position}
      size={{ width: node.width || 200, height: node.height || 100 }}
      onDragStop={handleDragStop}
      scale={zoom}
      className={`absolute ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
      onClick={handleNodeClick}
      enableResizing={false}
      disableDragging={!isDraggable}
      bounds="parent"
      dragGrid={[1, 1]} // Allow smooth dragging
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
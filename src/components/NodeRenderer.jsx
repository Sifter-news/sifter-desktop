import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './node/NodeContent';
import NodeTooltip from './node/NodeTooltip';

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
  isDragging 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: node.x, y: node.y });

  useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  useEffect(() => {
    setDragPosition({ x: node.x, y: node.y });
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

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width, height: node.height }}
        position={dragPosition}
        onDragStart={(e) => {
          e.stopPropagation();
          onDragStart?.(e, node.id);
        }}
        onDrag={(e, data) => {
          e.stopPropagation();
          setDragPosition({ x: data.x, y: data.y });
          onDrag?.(data, node.id);
        }}
        onDragStop={(e, data) => {
          e.stopPropagation();
          onDragEnd?.(data, node.id);
        }}
        scale={zoom}
        className={`relative ${
          isFocused 
            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' 
            : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1 hover:shadow-md hover:scale-[1.01]'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onClick={handleNodeClick}
        enableResizing={false}
        bounds="parent"
        dragHandleClassName="drag-handle"
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
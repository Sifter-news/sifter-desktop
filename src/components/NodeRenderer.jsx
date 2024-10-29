import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './node/NodeContent';
import NodeTooltip from './node/NodeTooltip';
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
      description: localDescription
    });
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

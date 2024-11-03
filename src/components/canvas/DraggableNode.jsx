import React, { useState, useRef } from 'react';
import NodeRenderer from '../NodeRenderer';
import { snapToGrid } from '@/utils/canvasUtils';

const DraggableNode = ({
  node,
  zoom,
  position,
  onNodeUpdate,
  onFocus,
  isFocused,
  isDraggable = true,
  activeTool,
  allNodes
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef(null);
  const nodeRef = useRef(null);

  const handleDragStart = (e) => {
    if (activeTool !== 'select') return;
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragStartPos.current = {
      x: node.x,
      y: node.y,
      mouseX: e.clientX,
      mouseY: e.clientY
    };
    setIsDragging(true);
  };

  const handleDrag = (e) => {
    if (!isDragging || !dragStartPos.current) return;

    const deltaX = (e.clientX - dragStartPos.current.mouseX) / zoom;
    const deltaY = (e.clientY - dragStartPos.current.mouseY) / zoom;

    const newX = dragStartPos.current.x + deltaX;
    const newY = dragStartPos.current.y + deltaY;

    const { x: snappedX, y: snappedY } = snapToGrid(newX, newY);

    onNodeUpdate(node.id, {
      x: snappedX,
      y: snappedY
    });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartPos.current = null;
  };

  return (
    <div
      ref={nodeRef}
      style={{
        position: 'absolute',
        left: `${node.x}px`,
        top: `${node.y}px`,
        cursor: activeTool === 'select' ? 'grab' : 'default'
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <NodeRenderer
        node={node}
        zoom={zoom}
        onNodeUpdate={onNodeUpdate}
        onFocus={onFocus}
        isFocused={isFocused}
        isDragging={isDragging}
        allNodes={allNodes}
      />
    </div>
  );
};

export default DraggableNode;
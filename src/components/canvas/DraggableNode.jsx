import React from 'react';
import TwoDNode from '../node/TwoDNode';
import { useCanvasCoordinates } from '@/hooks/useCanvasCoordinates';

const DraggableNode = ({
  node,
  zoom,
  position,
  canvasWidth,
  canvasHeight,
  onNodeUpdate,
  onFocus,
  isFocused,
  onDelete,
  isDraggable,
  activeTool
}) => {
  const { screenToCanvas, canvasToScreen } = useCanvasCoordinates(canvasWidth, canvasHeight, zoom, position);

  const handleDrag = (nodeId, dragData, rect) => {
    const canvasPos = screenToCanvas(dragData.x, dragData.y, rect);
    onNodeUpdate(nodeId, {
      x: canvasPos.x,
      y: canvasPos.y
    });
  };

  const screenPosition = canvasToScreen(node.x, node.y);

  return (
    <TwoDNode
      key={node.id}
      node={node}
      zoom={zoom}
      onNodeUpdate={(nodeId, dragData) => {
        const rect = document.querySelector('[data-canvas="true"]').getBoundingClientRect();
        handleDrag(nodeId, dragData, rect);
      }}
      onFocus={onFocus}
      isFocused={isFocused}
      onDelete={onDelete}
      isDraggable={isDraggable && activeTool !== 'pan'}
      position={screenPosition}
    />
  );
};

export default DraggableNode;
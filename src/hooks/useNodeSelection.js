import { useState, useCallback } from 'react';

export const useNodeSelection = (zoom) => {
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const startSelection = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectionStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  }, []);

  const updateSelection = useCallback((e, nodes, position) => {
    if (!isDragging || !selectionStart) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setSelectionEnd(currentPoint);

    // Convert screen coordinates to canvas coordinates
    const selectionBox = {
      left: Math.min(selectionStart.x, currentPoint.x),
      right: Math.max(selectionStart.x, currentPoint.x),
      top: Math.min(selectionStart.y, currentPoint.y),
      bottom: Math.max(selectionStart.y, currentPoint.y)
    };

    // Check which nodes are within the selection box
    const selected = nodes.filter(node => {
      const nodeX = (node.x * zoom) + position.x;
      const nodeY = (node.y * zoom) + position.y;

      return (
        nodeX >= selectionBox.left &&
        nodeX <= selectionBox.right &&
        nodeY >= selectionBox.top &&
        nodeY <= selectionBox.bottom
      );
    });

    setSelectedNodes(selected);
  }, [isDragging, selectionStart, zoom]);

  const endSelection = useCallback(() => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsDragging(false);
  }, []);

  return {
    selectionStart,
    selectionEnd,
    selectedNodes,
    isDragging,
    startSelection,
    updateSelection,
    endSelection,
    setSelectedNodes
  };
};
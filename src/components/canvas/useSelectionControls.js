import { useState, useCallback } from 'react';

export const useSelectionControls = (ref, zoom, nodes, onNodeFocus) => {
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleSelectionStart = useCallback((e, rect) => {
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
  }, [zoom]);

  const handleSelectionMove = useCallback((e, rect) => {
    if (!selectionStart) return;
    
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    setSelectionEnd({ x, y });

    // Calculate selection bounds
    const bounds = {
      left: Math.min(selectionStart.x, x),
      right: Math.max(selectionStart.x, x),
      top: Math.min(selectionStart.y, y),
      bottom: Math.max(selectionStart.y, y)
    };

    // Select nodes within bounds
    const selected = nodes.filter(node => 
      node.x >= bounds.left && 
      node.x <= bounds.right && 
      node.y >= bounds.top && 
      node.y <= bounds.bottom
    );
    
    setSelectedNodes(selected.map(node => node.id));
    if (selected.length === 1) {
      onNodeFocus(selected[0].id);
    }
  }, [selectionStart, zoom, nodes, onNodeFocus]);

  const clearSelection = useCallback(() => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setSelectedNodes([]);
  }, []);

  return {
    selectionStart,
    selectionEnd,
    selectedNodes,
    handleSelectionStart,
    handleSelectionMove,
    clearSelection
  };
};
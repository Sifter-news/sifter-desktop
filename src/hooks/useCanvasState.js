import { useState, useCallback } from 'react';
import { snapToGrid } from '@/utils/canvasUtils';

export const useCanvasState = (initialZoom = 1) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoom = useCallback((delta) => {
    setZoom((prev) => Math.max(0.1, Math.min(prev + delta, 2)));
  }, []);

  const startDrag = useCallback((x, y) => {
    setIsDragging(true);
    setDragStart({ x, y });
  }, []);

  const updateDrag = useCallback((x, y) => {
    if (isDragging) {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      setPosition(prev => ({
        x: snapToGrid(prev.x + dx),
        y: snapToGrid(prev.y + dy)
      }));
      setDragStart({ x, y });
    }
  }, [isDragging, dragStart]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    zoom,
    position,
    isDragging,
    handleZoom,
    startDrag,
    updateDrag,
    endDrag,
    setPosition
  };
};
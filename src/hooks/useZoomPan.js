import { useState, useCallback } from 'react';

export const useZoomPan = (initialZoom = 1) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const handleZoom = useCallback((delta, clientX, clientY) => {
    setZoom(prevZoom => {
      const newZoom = Math.max(0.1, Math.min(prevZoom + delta, 2));
      return newZoom;
    });
  }, []);

  const handlePanStart = useCallback(() => {
    setIsPanning(true);
  }, []);

  const handlePanMove = useCallback((e) => {
    if (isPanning) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  }, [isPanning]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  return {
    zoom,
    position,
    isPanning,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    setPosition
  };
};
import { useState, useCallback, useEffect } from 'react';

export const useZoomPan = (initialZoom = 1) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoom = useCallback((delta) => {
    setZoom((prevZoom) => Math.max(0.1, Math.min(prevZoom + delta, 5)));
  }, []);

  const handlePanStart = useCallback(() => {
    setIsPanning(true);
  }, []);

  const handlePanMove = useCallback((e) => {
    if (isPanning) {
      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  }, [isPanning]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === '=') {
          e.preventDefault();
          handleZoom(0.1);
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoom(-0.1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoom]);

  return {
    zoom,
    position,
    isPanning,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  };
};
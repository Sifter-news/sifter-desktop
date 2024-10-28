import { useState, useCallback, useEffect } from 'react';

export const useZoomPan = (initialZoom = 1) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoom = useCallback((delta, clientX, clientY) => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(0.1, Math.min(prevZoom + delta, 2));
      
      // Calculate the viewport center if no specific point is provided
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const pointX = clientX ?? viewportWidth / 2;
      const pointY = clientY ?? viewportHeight / 2;

      // Calculate how the position should change to keep the zoom point steady
      const zoomFactor = newZoom / prevZoom;
      const dx = (pointX - position.x) * (1 - zoomFactor);
      const dy = (pointY - position.y) * (1 - zoomFactor);

      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));

      return newZoom;
    });
  }, [position]);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      handleZoom(delta, e.clientX, e.clientY);
    }
  }, [handleZoom]);

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
    handleWheel,
    setPosition
  };
};

export const findAvailablePosition = (nodes) => {
  const nodeWidth = 200; // Assuming a default node width
  const nodeHeight = 200; // Assuming a default node height
  const padding = 20; // Space between nodes

  let x = 0;
  let y = 0;
  let maxY = 0;

  nodes.forEach(node => {
    if (node.y + nodeHeight > maxY) {
      maxY = node.y + nodeHeight;
    }
  });

  while (true) {
    const overlapping = nodes.some(node => 
      x < node.x + nodeWidth + padding &&
      x + nodeWidth + padding > node.x &&
      y < node.y + nodeHeight + padding &&
      y + nodeHeight + padding > node.y
    );

    if (!overlapping) {
      return { x, y };
    }

    x += nodeWidth + padding;

    if (x > window.innerWidth - nodeWidth) {
      x = 0;
      y = maxY + padding;
      maxY = y + nodeHeight;
    }
  }
};

export const snapToGrid = (x, y, gridSize = 40) => {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize
  };
};

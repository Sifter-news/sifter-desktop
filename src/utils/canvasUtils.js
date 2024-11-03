import { useState, useCallback, useEffect } from 'react';

export const useZoomPan = (initialZoom = 1) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoom = useCallback((delta, clientX, clientY) => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(0.1, Math.min(prevZoom + delta, 2));
      
      // Calculate the viewport center
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Use mouse position if available, otherwise use viewport center
      const zoomX = clientX ?? viewportWidth / 2;
      const zoomY = clientY ?? viewportHeight / 2;

      // Calculate the point in canvas space before and after zooming
      const beforeZoomX = (zoomX - position.x) / prevZoom;
      const beforeZoomY = (zoomY - position.y) / prevZoom;
      const afterZoomX = (zoomX - position.x) / newZoom;
      const afterZoomY = (zoomY - position.y) / newZoom;

      // Adjust position to maintain the same point under cursor
      setPosition(prev => ({
        x: prev.x + (afterZoomX - beforeZoomX) * newZoom,
        y: prev.y + (afterZoomY - beforeZoomY) * newZoom
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

export const snapToGrid = (x, y, gridSize = 1) => {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize
  };
};

export const snapToSingleAxis = (startPos, currentPos) => {
  // Calculate deltas
  const deltaX = Math.abs(currentPos.x - startPos.x);
  const deltaY = Math.abs(currentPos.y - startPos.y);
  
  // If moving more horizontally than vertically, lock to X axis
  if (deltaX > deltaY) {
    return {
      x: snapToGrid(currentPos.x, currentPos.y).x,
      y: startPos.y
    };
  }
  // Otherwise lock to Y axis
  return {
    x: startPos.x,
    y: snapToGrid(currentPos.x, currentPos.y).y
  };
};

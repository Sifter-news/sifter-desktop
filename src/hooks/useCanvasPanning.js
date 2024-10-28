import { useCallback, useState } from 'react';

export const useCanvasPanning = ({ 
  isSpacePressed, 
  activeTool, 
  handlePanStart, 
  handlePanMove, 
  handlePanEnd 
}) => {
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (isSpacePressed || activeTool === 'pan') {
      setIsPanning(true);
      setStartPanPosition({ x: e.clientX, y: e.clientY });
      handlePanStart();
      e.preventDefault();
    }
  }, [isSpacePressed, activeTool, handlePanStart]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      const deltaX = e.clientX - startPanPosition.x;
      const deltaY = e.clientY - startPanPosition.y;
      handlePanMove({ movementX: deltaX, movementY: deltaY });
      setStartPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, handlePanMove, startPanPosition]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd();
    }
  }, [isPanning, handlePanEnd]);

  return {
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
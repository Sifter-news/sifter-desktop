import { useState, useCallback, useEffect } from 'react';

export const useCanvasControls = (activeTool, handlePanMove) => {
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isCanvasGrabbed, setIsCanvasGrabbed] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        setIsSpacePressed(true);
        document.body.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleCanvasMouseDown = useCallback((e) => {
    // Only initiate canvas grab if we're using the pan tool or space is pressed
    // AND we're clicking the canvas itself (not a node)
    if ((activeTool === 'pan' || isSpacePressed) && e.target === e.currentTarget) {
      e.preventDefault(); // Prevent text selection
      setIsCanvasGrabbed(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = 'grabbing';
    }
  }, [activeTool, isSpacePressed]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (isCanvasGrabbed) {
      e.preventDefault(); // Prevent text selection while dragging
      const dx = e.clientX - lastMousePosition.x;
      const dy = e.clientY - lastMousePosition.y;
      handlePanMove({ movementX: dx, movementY: dy });
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [isCanvasGrabbed, lastMousePosition, handlePanMove]);

  const handleCanvasMouseUp = useCallback((e) => {
    if (isCanvasGrabbed) {
      e.preventDefault();
      setIsCanvasGrabbed(false);
      document.body.style.cursor = isSpacePressed ? 'grab' : 'default';
    }
  }, [isSpacePressed, isCanvasGrabbed]);

  const handleCanvasMouseLeave = useCallback((e) => {
    if (isCanvasGrabbed) {
      e.preventDefault();
      setIsCanvasGrabbed(false);
      document.body.style.cursor = isSpacePressed ? 'grab' : 'default';
    }
  }, [isSpacePressed, isCanvasGrabbed]);

  return {
    isCanvasGrabbed,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasMouseLeave,
  };
};
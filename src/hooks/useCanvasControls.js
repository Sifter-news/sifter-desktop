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
    if (e.target === e.currentTarget && (activeTool === 'pan' || isSpacePressed)) {
      setIsCanvasGrabbed(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = 'grabbing';
    }
  }, [activeTool, isSpacePressed]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (isCanvasGrabbed) {
      const dx = e.clientX - lastMousePosition.x;
      const dy = e.clientY - lastMousePosition.y;
      handlePanMove({ movementX: dx, movementY: dy });
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [isCanvasGrabbed, lastMousePosition, handlePanMove]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsCanvasGrabbed(false);
    document.body.style.cursor = isSpacePressed ? 'grab' : 'default';
  }, [isSpacePressed]);

  const handleCanvasMouseLeave = useCallback(() => {
    setIsCanvasGrabbed(false);
    document.body.style.cursor = isSpacePressed ? 'grab' : 'default';
  }, [isSpacePressed]);

  return {
    isCanvasGrabbed,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasMouseLeave,
  };
};
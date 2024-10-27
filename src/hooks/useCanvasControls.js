import { useState, useCallback, useEffect } from 'react';

export const useCanvasControls = (activeTool, handlePanMove, handleZoom) => {
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isCanvasGrabbed, setIsCanvasGrabbed] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if it's not already pressed and not in an input
      if (e.code === 'Space' && !e.repeat && e.target === document.body) {
        e.preventDefault();
        setIsSpacePressed(true);
        document.body.style.cursor = 'grab';
      }
      
      // Zoom shortcuts
      if (e.metaKey || e.ctrlKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoom(0.1);
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleZoom(-0.1);
        } else if (e.key === '0') {
          e.preventDefault();
          handleZoom('reset');
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsCanvasGrabbed(false);
        document.body.style.cursor = 'default';
      }
    };

    const handleWheel = (e) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        handleZoom(delta);
      } else if (e.shiftKey) {
        e.preventDefault();
        handlePanMove({ movementX: -e.deltaY, movementY: -e.deltaX });
      } else {
        handlePanMove({ movementX: -e.deltaX, movementY: -e.deltaY });
      }
    };

    // Add blur event to handle cases where window loses focus
    const handleBlur = () => {
      setIsSpacePressed(false);
      setIsCanvasGrabbed(false);
      document.body.style.cursor = 'default';
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleZoom, handlePanMove]);

  const handleCanvasMouseDown = useCallback((e) => {
    if ((activeTool === 'pan' || isSpacePressed) && e.target === e.currentTarget) {
      e.preventDefault();
      setIsCanvasGrabbed(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = 'grabbing';
    }
  }, [activeTool, isSpacePressed]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (isCanvasGrabbed) {
      e.preventDefault();
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

  // Touch events for mobile/trackpad gestures
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setLastTouchDistance(distance);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      if (lastTouchDistance !== null) {
        const delta = distance - lastTouchDistance;
        handleZoom(delta * 0.01);
      }
      
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1) {
      // Single finger pan
      const touch = e.touches[0];
      if (lastMousePosition.x && lastMousePosition.y) {
        const dx = touch.clientX - lastMousePosition.x;
        const dy = touch.clientY - lastMousePosition.y;
        handlePanMove({ movementX: dx, movementY: dy });
      }
      setLastMousePosition({ x: touch.clientX, y: touch.clientY });
    }
  }, [lastTouchDistance, lastMousePosition, handleZoom, handlePanMove]);

  const handleTouchEnd = useCallback(() => {
    setLastTouchDistance(null);
    setLastMousePosition({ x: 0, y: 0 });
  }, []);

  return {
    isCanvasGrabbed,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
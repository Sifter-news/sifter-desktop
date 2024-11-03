import { useCallback } from 'react';

export const useCanvasCoordinates = (canvasWidth, canvasHeight, zoom, position) => {
  const screenToCanvas = useCallback((screenX, screenY, rect) => {
    const canvasX = ((screenX - rect.left) / zoom) - (position.x / zoom) - canvasWidth/2;
    const canvasY = ((screenY - rect.top) / zoom) - (position.y / zoom) - canvasHeight/2;
    return { x: canvasX, y: canvasY };
  }, [zoom, position, canvasWidth, canvasHeight]);

  const canvasToScreen = useCallback((canvasX, canvasY) => {
    return {
      x: (canvasX + canvasWidth/2) * zoom + position.x,
      y: (canvasY + canvasHeight/2) * zoom + position.y
    };
  }, [zoom, position, canvasWidth, canvasHeight]);

  return { screenToCanvas, canvasToScreen };
};
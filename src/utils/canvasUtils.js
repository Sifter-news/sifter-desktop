export const snapToGrid = (x, y, gridSize = 8) => {
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

export const getCanvasCoordinates = (clientX, clientY, rect, zoom, position) => {
  const x = (clientX - rect.left - position.x) / zoom;
  const y = (clientY - rect.top - position.y) / zoom;
  return { x, y };
};

export const getScreenCoordinates = (canvasX, canvasY, zoom, position) => {
  return {
    x: canvasX * zoom + position.x,
    y: canvasY * zoom + position.y
  };
};

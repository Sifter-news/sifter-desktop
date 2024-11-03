export const snapToGrid = (x, y, gridSize = 8) => {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize
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

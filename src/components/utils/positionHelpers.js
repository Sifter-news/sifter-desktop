// Position utilities for both 2D and 3D nodes
export const calculateNodePosition = (node, canvas) => {
  if (canvas === '3d') {
    return {
      x: node.position[0],
      y: node.position[1],
      z: node.position[2] * 2 || 0 // Double Z position for better depth perception
    };
  }
  
  return {
    x: node.x || 0,
    y: node.y || 0
  };
};

export const snapToGrid = (position, gridSize = 8) => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
    z: position.z ? Math.round(position.z / gridSize) * gridSize : 0
  };
};
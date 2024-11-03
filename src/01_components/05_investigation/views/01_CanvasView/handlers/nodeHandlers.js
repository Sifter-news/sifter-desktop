export const handleNodeDrag = ({ zoom, position }) => {
  return (nodeId, dragData) => {
    const adjustedX = dragData.x;
    const adjustedY = dragData.y;
    
    return {
      x: adjustedX,
      y: adjustedY
    };
  };
};
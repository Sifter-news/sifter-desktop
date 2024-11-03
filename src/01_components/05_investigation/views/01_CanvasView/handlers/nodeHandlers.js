export const handleNodeDrag = ({ zoom, position }) => {
  return (nodeId, dragData) => {
    return {
      x: dragData.x,
      y: dragData.y
    };
  };
};
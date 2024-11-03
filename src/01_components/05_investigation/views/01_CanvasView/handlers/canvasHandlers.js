export const handleCanvasInteraction = ({
  activeTool,
  activeConnection,
  canvasRef,
  position,
  zoom,
  setActiveConnection
}) => {
  const handleMouseDown = (e) => {
    // Only handle middle mouse button
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e) => {
    if (activeConnection && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      setActiveConnection(prev => ({
        ...prev,
        endX: x,
        endY: y
      }));
    }
  };

  const handleMouseUp = (e) => {
    if (activeConnection) {
      setActiveConnection(null);
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
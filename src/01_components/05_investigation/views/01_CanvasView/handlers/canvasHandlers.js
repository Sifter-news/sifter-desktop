export const handleCanvasInteraction = ({
  activeTool,
  isPanning,
  setIsPanning,
  handlePanStart,
  handlePanMove,
  handlePanEnd,
  activeConnection,
  canvasRef,
  position,
  zoom,
  setActiveConnection
}) => {
  const handleMouseDown = (e) => {
    if (e.button === 1 || activeTool === 'pan') {
      setIsPanning(true);
      handlePanStart?.();
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && handlePanMove) {
      handlePanMove({
        movementX: e.movementX,
        movementY: e.movementY
      });
      e.preventDefault();
      e.stopPropagation();
    }
    
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
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd?.();
      e.preventDefault();
      e.stopPropagation();
    }

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
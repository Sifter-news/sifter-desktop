import React from 'react';

const PanningControls = ({ 
  isDragging, 
  activeTool, 
  isSpacePressed,
  handlePanStart,
  handlePanMove,
  handlePanEnd,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleWheelZoom,
  children,
  ref
}) => {
  return (
    <div 
      className={`w-full h-full bg-[#594BFF] overflow-hidden ${
        (isSpacePressed || activeTool === 'pan') ? 'cursor-grab active:cursor-grabbing' : 
        activeTool === 'select' ? 'cursor-default' : 'cursor-default'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheelZoom}
      ref={ref}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default PanningControls;
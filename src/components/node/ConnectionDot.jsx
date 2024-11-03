import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover, 
  onStartConnection,
  nodeId
}) => {
  const baseStyles = "absolute w-2 h-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 transform cursor-crosshair opacity-0 group-hover:opacity-100";
  const positionStyles = {
    top: "left-1/2 -translate-x-1/2 -top-4",
    bottom: "left-1/2 -translate-x-1/2 -bottom-4",
    left: "top-1/2 -translate-y-1/2 -left-4",
    right: "top-1/2 -translate-y-1/2 -right-4"
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    onStartConnection(nodeId, position, { x: startX, y: startY });
  };

  return (
    <div
      className={`${baseStyles} ${positionStyles[position]} ${isHovered ? 'scale-150' : 'scale-100'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ConnectionDot;
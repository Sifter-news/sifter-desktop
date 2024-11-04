import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover, 
  onStartConnection,
  nodeId
}) => {
  const baseStyles = "absolute w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200 transform cursor-crosshair opacity-0 group-hover:opacity-100 border-2 border-white";
  
  const getPositionStyles = () => {
    const positions = {
      'left': 'top-1/2 -left-1.5 -translate-y-1/2',
      'right': 'top-1/2 -right-1.5 -translate-y-1/2',
      'top': 'left-1/2 -top-1.5 -translate-x-1/2',
      'bottom': 'left-1/2 -bottom-1.5 -translate-x-1/2'
    };
    return positions[position] || '';
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const startX = rect.left + (rect.width / 2);
    const startY = rect.top + (rect.height / 2);
    onStartConnection(nodeId, position, { x: startX, y: startY });
  };

  return (
    <div
      className={`${baseStyles} ${getPositionStyles()} ${isHovered ? 'scale-125' : 'scale-100'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ConnectionDot;
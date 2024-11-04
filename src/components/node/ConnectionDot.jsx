import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover, 
  onStartConnection,
  nodeId
}) => {
  const baseStyles = "absolute w-1 h-1 rounded-full bg-black/30 hover:bg-black transition-all duration-200 transform cursor-crosshair opacity-0 group-hover:opacity-100";
  
  const getPositionStyles = () => {
    const positions = {
      'left': 'top-1/2 -left-5 -translate-y-1/2',
      'right': 'top-1/2 -right-5 -translate-x-1/2',
      'top': '-top-5 left-1/2 -translate-x-1/2',
      'bottom': '-bottom-5 left-1/2 -translate-x-1/2'
    };
    return positions[position] || '';
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the dot element's bounding rectangle
    const rect = e.target.getBoundingClientRect();
    // Calculate the center point of the dot
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
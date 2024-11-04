import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover, 
  onStartConnection,
  nodeId
}) => {
  const baseStyles = "absolute w-1 h-1 rounded-full bg-black/30 hover:bg-black hover:w-2 hover:h-2 hover:border hover:border-white transition-all duration-200 transform cursor-crosshair opacity-0 group-hover:opacity-100";
  
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
    const dotCenter = {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2)
    };

    // Calculate the start point based on the position (edge of the node)
    let startPoint;
    switch (position) {
      case 'left':
        startPoint = { x: rect.right, y: dotCenter.y };
        break;
      case 'right':
        startPoint = { x: rect.left, y: dotCenter.y };
        break;
      case 'top':
        startPoint = { x: dotCenter.x, y: rect.bottom };
        break;
      case 'bottom':
        startPoint = { x: dotCenter.x, y: rect.top };
        break;
      default:
        startPoint = dotCenter;
    }
    
    onStartConnection(nodeId, position, startPoint);
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
import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover,
  onDotClick,
  nodeId,
  isActive = false,
  node
}) => {
  const getPosition = () => {
    switch (position) {
      case 'left':
        return 'left-[-4px] top-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'right':
        return 'right-[-4px] top-1/2 translate-x-1/2 -translate-y-1/2';
      case 'top':
        return 'top-[-4px] left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom':
        return 'bottom-[-4px] left-1/2 -translate-x-1/2 translate-y-1/2';
      default:
        return '';
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const point = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onDotClick(nodeId, point, position);
  };

  return (
    <div
      className={`absolute w-3 h-3 rounded-full cursor-crosshair ring-1 ring-white shadow-md
        ${getPosition()}
        ${isActive ? 'bg-blue-600 scale-125' : isHovered ? 'bg-blue-400' : 'bg-gray-400'} 
        transition-all duration-200 hover:scale-150 z-50`}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={handleClick}
      onMouseUp={handleClick}
      style={{
        aspectRatio: '1 / 1',
      }}
    />
  );
};

export default ConnectionDot;
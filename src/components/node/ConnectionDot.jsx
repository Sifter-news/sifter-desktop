import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover,
  onDotClick,
  nodeId,
  isActive = false
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

  const handleMouseDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`absolute w-2 h-2 rounded-full cursor-pointer
        ${getPosition()}
        ${isActive ? 'bg-blue-500' : isHovered ? 'bg-blue-300' : 'bg-gray-300'} 
        transition-all duration-200 hover:scale-150`}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onDotClick(nodeId, position);
      }}
    />
  );
};

export default ConnectionDot;
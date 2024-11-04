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
        return 'left-[-6px] top-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'right':
        return 'right-[-6px] top-1/2 translate-x-1/2 -translate-y-1/2';
      case 'top':
        return 'top-[-6px] left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom':
        return 'bottom-[-6px] left-1/2 -translate-x-1/2 translate-y-1/2';
      default:
        return '';
    }
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`absolute w-1.5 h-1.5 rounded-full cursor-pointer ring-1 ring-white shadow-[0_0_4px_rgba(0,0,0,0.4)]
        ${getPosition()}
        ${isActive ? 'bg-blue-600' : isHovered ? 'bg-blue-400' : 'bg-gray-400'} 
        transition-all duration-200 hover:scale-150`}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onDotClick(nodeId, position);
      }}
      style={{
        aspectRatio: '1 / 1',
        minWidth: '6px',
        minHeight: '6px',
        maxWidth: '6px',
        maxHeight: '6px'
      }}
    />
  );
};

export default ConnectionDot;
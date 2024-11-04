import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover,
  onStartConnection,
  onEndConnection,
  nodeId
}) => {
  const getPosition = () => {
    switch (position) {
      case 'left':
        return 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'right':
        return 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2';
      case 'top':
        return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
      default:
        return '';
    }
  };

  return (
    <div
      className={`absolute w-2 h-2 rounded-full cursor-crosshair
        ${getPosition()} 
        ${isHovered ? 'scale-[2] border-2 border-black' : 'scale-100 border border-gray-400'} 
        transition-all duration-200 origin-center`}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={(e) => {
        e.stopPropagation();
        onStartConnection?.(nodeId, position);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        onEndConnection?.(nodeId, position);
      }}
      draggable={false}
    >
      <div className="absolute top-1/2 left-1/2 w-[2px] h-[2px] bg-black opacity-50 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default ConnectionDot;
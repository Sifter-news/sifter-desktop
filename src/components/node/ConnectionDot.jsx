import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover, 
  onStartConnection 
}) => {
  const baseStyles = "absolute w-2 h-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 transform cursor-crosshair";
  const positionStyles = {
    top: "left-1/2 -translate-x-1/2 top-0",
    bottom: "left-1/2 -translate-x-1/2 bottom-0",
    left: "top-1/2 -translate-y-1/2 left-0",
    right: "top-1/2 -translate-y-1/2 right-0"
  };

  return (
    <div
      className={`${baseStyles} ${positionStyles[position]} ${isHovered ? 'scale-150' : 'scale-100'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={(e) => {
        e.stopPropagation();
        onStartConnection();
      }}
    />
  );
};

export default ConnectionDot;
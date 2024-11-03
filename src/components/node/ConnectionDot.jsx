import React from 'react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover, 
  onStartConnection 
}) => {
  const baseStyles = "absolute w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-200 transform cursor-crosshair";
  const positionStyles = {
    top: "left-1/2 -translate-x-1/2 -top-4",
    bottom: "left-1/2 -translate-x-1/2 -bottom-4",
    left: "top-1/2 -translate-y-1/2 -left-4",
    right: "top-1/2 -translate-y-1/2 -right-4"
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
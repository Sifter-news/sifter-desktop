import React from 'react';
import { Circle } from 'lucide-react';

const ConnectionDot = ({ position, isHovered, onHover, onLeaveHover, onStartConnection }) => {
  const baseStyles = "absolute w-2 h-2 rounded-full bg-white transition-all duration-200 transform";
  const positionStyles = {
    top: "left-1/2 -translate-x-1/2 -top-1",
    bottom: "left-1/2 -translate-x-1/2 -bottom-1",
    left: "top-1/2 -translate-y-1/2 -left-1",
    right: "top-1/2 -translate-y-1/2 -right-1"
  };

  return (
    <div
      className={`${baseStyles} ${positionStyles[position]} ${isHovered ? 'scale-[3]' : 'scale-100'}`}
      style={{ opacity: isHovered ? 1 : 0.5 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={(e) => {
        e.stopPropagation();
        onStartConnection(position);
      }}
    >
      <Circle className="w-full h-full" />
    </div>
  );
};

export default ConnectionDot;
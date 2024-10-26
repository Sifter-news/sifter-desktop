import React from 'react';
import { Circle } from 'lucide-react';

const ConnectionDot = ({ position, isHovered, onHover, onLeaveHover, onStartConnection }) => {
  const baseStyles = "absolute w-2 h-2 rounded-full bg-white transition-opacity duration-200";
  const positionStyles = {
    top: "left-1/2 -translate-x-1/2 -top-3",
    bottom: "left-1/2 -translate-x-1/2 -bottom-3",
    left: "top-1/2 -translate-y-1/2 -left-3",
    right: "top-1/2 -translate-y-1/2 -right-3"
  };

  return (
    <div
      className={`${baseStyles} ${positionStyles[position]}`}
      style={{ opacity: isHovered ? 1 : 0.5 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={(e) => {
        e.stopPropagation();
        onStartConnection();
      }}
    >
      <Circle className="w-full h-full" />
    </div>
  );
};

export default ConnectionDot;
import React from 'react';
import { cn } from "@/lib/utils";

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover, 
  onStartConnection,
  nodeId
}) => {
  const positionStyles = {
    top: "left-1/2 -translate-x-1/2 -top-1",
    bottom: "left-1/2 -translate-x-1/2 -bottom-1",
    left: "top-1/2 -translate-y-1/2 -left-1",
    right: "top-1/2 -translate-y-1/2 -right-1"
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    onStartConnection(nodeId, position, { x: startX, y: startY });
  };

  return (
    <div
      className={cn(
        "absolute w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-200",
        "transform cursor-crosshair opacity-0 group-hover:opacity-100",
        "ring-2 ring-white/50 hover:ring-white",
        isHovered && "scale-150 bg-white/70",
        positionStyles[position]
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ConnectionDot;
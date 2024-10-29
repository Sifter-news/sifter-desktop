import React from 'react';
import { Circle } from 'lucide-react';

const ConnectionDot = ({ 
  position, 
  isHovered, 
  onHover, 
  onLeaveHover, 
  onStartConnection 
}) => {
  return (
    <div
      className={`
        absolute w-3 h-3 rounded-full bg-blue-500 
        transition-all duration-200 transform cursor-crosshair
        ${isHovered ? 'scale-150 bg-blue-600' : 'scale-100'}
        ${position === 'top' ? '-translate-y-1/2' : 'translate-y-1/2'}
      `}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
      onMouseDown={(e) => {
        e.stopPropagation();
        onStartConnection(position);
      }}
    />
  );
};

export default ConnectionDot;
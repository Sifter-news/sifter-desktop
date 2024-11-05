import React from 'react';
import { cn } from "@/lib/utils";

const ConnectorLine = ({
  startX,
  startY,
  endX,
  endY,
  className,
  strokeWidth = 2,
  strokeOpacity = 0.6,
  isDashed = false,
  onClick
}) => {
  const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <path
        d={pathData}
        className={cn("stroke-current fill-none transition-colors", className)}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeDasharray={isDashed ? "5,5" : "none"}
        onClick={onClick}
        style={{ pointerEvents: onClick ? 'all' : 'none' }}
      />
    </svg>
  );
};

export default ConnectorLine;
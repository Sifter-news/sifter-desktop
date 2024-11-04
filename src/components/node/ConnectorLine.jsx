import React from 'react';

const ConnectorLine = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  isDashed = false,
  isSelected = false,
  onClick,
  className = "",
  strokeWidth = 2,
  strokeOpacity = 0.6
}) => {
  // Create a curved path between points with proper offset handling
  const controlPoint1X = (startX + 48) + ((endX + 48) - (startX + 48)) / 2;
  const controlPoint1Y = startY;
  const controlPoint2X = (startX + 48) + ((endX + 48) - (startX + 48)) / 2;
  const controlPoint2Y = endY;
  
  const path = `M ${startX + 48},${startY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX + 48},${endY}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'all',
        zIndex: 10,
        overflow: 'visible'
      }}
      onClick={onClick}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon 
            points="0 0, 10 3.5, 0 7" 
            fill={isSelected ? "#3b82f6" : "#6B7280"} 
            opacity={strokeOpacity}
          />
        </marker>
      </defs>

      <path
        d={path}
        stroke={isSelected ? "#3b82f6" : "#6B7280"}
        strokeWidth={strokeWidth}
        strokeDasharray={isDashed ? "5,5" : "none"}
        strokeOpacity={strokeOpacity}
        fill="none"
        markerEnd="url(#arrowhead)"
        className={`transition-all duration-200 ${className}`}
      />
    </svg>
  );
};

export default ConnectorLine;
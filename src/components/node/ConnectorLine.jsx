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
  // Calculate the midpoint for creating an elbow connection
  const midX = startX;
  const midY = endY;

  // Create elbowed path with right angles for better visual hierarchy
  const path = `M ${startX} ${startY} L ${midX} ${midY} L ${endX} ${endY}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'all',
        zIndex: 10
      }}
      onClick={onClick}
    >
      {/* Define arrowhead marker for connection endpoints */}
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

      {/* Draw the connection path */}
      <path
        d={path}
        stroke={isSelected ? "#3b82f6" : "#6B7280"}
        strokeWidth={strokeWidth}
        strokeDasharray={isDashed ? "5,5" : "none"}
        strokeOpacity={strokeOpacity}
        fill="none"
        markerEnd="url(#arrowhead)"
        className={className}
      />
    </svg>
  );
};

export default ConnectorLine;
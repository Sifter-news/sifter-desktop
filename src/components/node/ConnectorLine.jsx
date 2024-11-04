import React from 'react';

const ConnectorLine = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  isDashed = false,
  isSelected = false,
  onClick,
  className = ""
}) => {
  // Calculate control points for the curved path
  const midY = startY + (endY - startY) / 2;
  const path = `
    M ${startX} ${startY}
    L ${startX} ${midY}
    Q ${startX} ${endY} ${startX + 20} ${endY}
    L ${endX} ${endY}
  `;

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
      <path
        d={path}
        stroke={isSelected ? "#3b82f6" : "#9CA3AF"}
        strokeWidth={isSelected ? "2" : "1.5"}
        strokeDasharray={isDashed ? "5,5" : "none"}
        strokeOpacity="0.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ConnectorLine;
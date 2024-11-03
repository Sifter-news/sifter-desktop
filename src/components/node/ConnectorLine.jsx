import React from 'react';

const ConnectorLine = ({ startX, startY, endX, endY, isDashed = false }) => {
  // Calculate control points for orthogonal path
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const path = `M ${startX} ${startY} 
                L ${midX} ${startY} 
                Q ${midX} ${midY} ${midX} ${midY}
                L ${midX} ${endY}
                L ${endX} ${endY}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
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
          <polygon points="0 0, 10 3.5, 0 7" fill="#fff" />
        </marker>
      </defs>
      <path
        d={path}
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isDashed ? "5,5" : "none"}
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
};

export default ConnectorLine;
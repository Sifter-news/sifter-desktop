import React from 'react';

const CanvasBackground = ({ zoom, position }) => {
  return (
    <div 
      className="absolute inset-0" 
      style={{
        width: '100%',
        height: '100%',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '120px 120px',
        transformOrigin: '0 0',
        transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
      }}
    />
  );
};

export default CanvasBackground;
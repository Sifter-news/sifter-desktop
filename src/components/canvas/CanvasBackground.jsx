import React from 'react';

const CanvasBackground = ({ zoom, position }) => {
  const smallGridSize = 2;
  const largeGridSize = 2 * 8;
  
  const transformStyle = {
    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
    position: 'absolute',
    top: '50%',
    left: '50%'
  };
  
  return (
    <div className="absolute inset-0 bg-white">
      <div 
        className="absolute inset-0" 
        style={{
          ...transformStyle,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: `
            ${smallGridSize * zoom}px ${smallGridSize * zoom}px,
            ${smallGridSize * zoom}px ${smallGridSize * zoom}px,
            ${largeGridSize * zoom}px ${largeGridSize * zoom}px,
            ${largeGridSize * zoom}px ${largeGridSize * zoom}px
          `
        }}
      />
    </div>
  );
};

export default CanvasBackground;
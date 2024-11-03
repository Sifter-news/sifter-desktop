import React from 'react';

const CanvasBackground = ({ zoom, position }) => {
  const smallGridSize = 2;
  const largeGridSize = 2 * 8;
  const canvasWidth = 10000;
  const canvasHeight = 10000;
  const centerOffsetX = -canvasWidth / 2;
  const centerOffsetY = -canvasHeight / 2;
  
  return (
    <div className="absolute inset-0 bg-white">
      <div 
        className="absolute" 
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          left: `${centerOffsetX}px`,
          top: `${centerOffsetY}px`,
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
          `,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
    </div>
  );
};

export default CanvasBackground;
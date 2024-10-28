import React from 'react';

const CanvasGrid = ({ zoom, position }) => {
  // Calculate grid properties based on zoom level
  const gridSize = 24; // Base grid size in pixels
  const majorGridInterval = 5; // Number of minor grid lines between major grid lines
  
  // Calculate the apparent grid size based on zoom
  const apparentGridSize = gridSize * zoom;
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to right, rgba(255,255,255,0.2) ${apparentGridSize}px, transparent ${apparentGridSize}px),
          linear-gradient(to bottom, rgba(255,255,255,0.2) ${apparentGridSize}px, transparent ${apparentGridSize}px)
        `,
        backgroundSize: `
          ${apparentGridSize / majorGridInterval}px ${apparentGridSize / majorGridInterval}px,
          ${apparentGridSize / majorGridInterval}px ${apparentGridSize / majorGridInterval}px,
          ${apparentGridSize}px ${apparentGridSize}px,
          ${apparentGridSize}px ${apparentGridSize}px
        `,
        backgroundPosition: `
          ${position.x % (apparentGridSize / majorGridInterval)}px ${position.y % (apparentGridSize / majorGridInterval)}px,
          ${position.x % (apparentGridSize / majorGridInterval)}px ${position.y % (apparentGridSize / majorGridInterval)}px,
          ${position.x % apparentGridSize}px ${position.y % apparentGridSize}px,
          ${position.x % apparentGridSize}px ${position.y % apparentGridSize}px
        `,
      }}
    />
  );
};

export default CanvasGrid;
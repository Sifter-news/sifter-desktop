import React, { useMemo } from 'react';

const CanvasBackground = ({ zoom, position }) => {
  const gridConfig = useMemo(() => {
    const smallGrid = 32;  
    const mediumGrid = 64; 
    const largeGrid = 96;  
    
    let primarySize;
    if (zoom < 0.5) {
      primarySize = largeGrid;
    } else if (zoom < 1) {
      primarySize = mediumGrid;
    } else {
      primarySize = smallGrid;
    }
    
    return {
      dotSize: 1, 
      spacing: primarySize,
      opacity: Math.min(0.3, 0.1 + zoom * 0.1) 
    };
  }, [zoom]);

  return (
    <div className="absolute inset-0 bg-white">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(0, 0, 0, 0.3) ${gridConfig.dotSize}px, transparent ${gridConfig.dotSize}px)
          `,
          backgroundSize: `
            ${gridConfig.spacing * zoom}px ${gridConfig.spacing * zoom}px
          `,
          backgroundPosition: `
            ${position.x}px ${position.y}px
          `,
          transition: 'opacity 0.2s ease-in-out'
        }}
      />
    </div>
  );
};

export default CanvasBackground;
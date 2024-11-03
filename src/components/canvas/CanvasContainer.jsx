import React from 'react';
import { useDebug } from '@/contexts/DebugContext';

const CanvasContainer = ({ 
  children, 
  zoom, 
  position, 
  canvasWidth = 10000,
  canvasHeight = 10000,
  centerOffsetX = -5000,
  centerOffsetY = -5000
}) => {
  const { showGuides } = useDebug();
  
  const transformStyle = {
    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
    transformOrigin: '50% 50%',
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: `${centerOffsetX}px`,
    marginTop: `${centerOffsetY}px`
  };

  return (
    <div 
      className={`${showGuides ? 'outline outline-1 outline-blue-500/20' : ''}`}
      style={transformStyle}
      data-canvas-container
    >
      {children}
    </div>
  );
};

export default CanvasContainer;
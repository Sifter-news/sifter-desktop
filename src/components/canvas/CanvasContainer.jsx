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
    transformOrigin: '0 0',
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    left: `${centerOffsetX}px`,
    top: `${centerOffsetY}px`
  };

  return (
    <div 
      className={`absolute inset-0 ${showGuides ? 'outline outline-1 outline-blue-500/20' : ''}`}
      style={transformStyle}
      data-canvas-container
    >
      {children}
    </div>
  );
};

export default CanvasContainer;
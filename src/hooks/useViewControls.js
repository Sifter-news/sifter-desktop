import { useState, useRef, useEffect } from 'react';

export const useViewControls = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('2d');
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      if (viewMode === '2d') {
        controlsRef.current.setAzimuthalAngle(0);
        controlsRef.current.setPolarAngle(0);
        controlsRef.current.enableRotate = false;
      } else {
        controlsRef.current.setAzimuthalAngle(Math.PI / 4);
        controlsRef.current.setPolarAngle(Math.PI / 4);
        controlsRef.current.enableRotate = true;
      }
    }
  }, [viewMode]);

  return {
    activeTool,
    setActiveTool,
    zoom,
    setZoom,
    viewMode,
    setViewMode,
    controlsRef
  };
};
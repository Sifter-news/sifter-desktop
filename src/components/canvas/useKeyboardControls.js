import { useState, useEffect, useCallback } from 'react';

export const useKeyboardControls = (activeTool, setActiveTool) => {
  const [previousTool, setPreviousTool] = useState(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && !isSpacePressed) {
      e.preventDefault(); // Prevent page scroll
      setIsSpacePressed(true);
      setPreviousTool(activeTool);
      setActiveTool('pan');
      document.body.style.cursor = 'grab';
    }
  }, [activeTool, isSpacePressed, setActiveTool]);

  const handleKeyUp = useCallback((e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setIsSpacePressed(false);
      if (previousTool) {
        setActiveTool(previousTool);
      }
      document.body.style.cursor = 'default';
    }
  }, [previousTool, setActiveTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { isSpacePressed };
};
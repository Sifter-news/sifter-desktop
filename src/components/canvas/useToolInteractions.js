import { useCallback } from 'react';

export const useToolInteractions = (activeTool, isSpacePressed, handlePanStart, handleSelectionStart) => {
  const handleToolInteraction = useCallback((e, ref) => {
    if (e.target !== ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    if (activeTool === 'pan' || isSpacePressed) {
      handlePanStart();
      document.body.style.cursor = 'grabbing';
    } else if (activeTool === 'select') {
      handleSelectionStart(e, rect);
      document.body.style.cursor = 'crosshair';
    }
  }, [activeTool, isSpacePressed, handlePanStart, handleSelectionStart]);

  const resetCursor = useCallback(() => {
    document.body.style.cursor = activeTool === 'pan' ? 'grab' : 'default';
  }, [activeTool]);

  return {
    handleToolInteraction,
    resetCursor
  };
};
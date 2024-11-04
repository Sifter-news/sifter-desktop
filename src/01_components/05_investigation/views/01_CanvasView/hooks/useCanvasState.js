import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useCanvasState = (initialZoom = 1) => {
  const [activeTool, setActiveTool] = useState('select');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleToolChange = useCallback((tool) => {
    setActiveTool(tool);
    toast.info(`Switched to ${tool} tool`);
  }, []);

  const handleAIChatToggle = useCallback(() => {
    setIsAIChatOpen(prev => !prev);
  }, []);

  const handleDragStart = useCallback((item) => {
    setDraggedItem(item);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  return {
    activeTool,
    isAIChatOpen,
    draggedItem,
    handleToolChange,
    handleAIChatToggle,
    handleDragStart,
    handleDragEnd
  };
};
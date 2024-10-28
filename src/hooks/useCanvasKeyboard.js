import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { copyNode, pasteNode } from '@/utils/clipboardUtils';

export const useCanvasKeyboard = ({ 
  focusedNodeId, 
  nodes, 
  onNodeDelete, 
  setNodes, 
  isSpacePressed,
  setIsSpacePressed,
  activeTool,
  setActiveTool,
  previousTool,
  setPreviousTool 
}) => {
  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && !isSpacePressed) {
      e.preventDefault();
      setIsSpacePressed(true);
      setPreviousTool(activeTool);
      setActiveTool('pan');
    } else if (focusedNodeId && (e.key === 'Delete' || e.key === 'Backspace')) {
      onNodeDelete(focusedNodeId);
      toast.success("Node deleted");
    } else if (focusedNodeId && (e.metaKey || e.ctrlKey) && e.key === 'c') {
      const nodeToCopy = nodes.find(node => node.id === focusedNodeId);
      if (nodeToCopy) {
        copyNode(nodeToCopy);
        toast.success("Node copied to clipboard");
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
      const newNode = pasteNode();
      if (newNode) {
        setNodes(prev => [...prev, newNode]);
        toast.success("Node pasted from clipboard");
      }
    }
  }, [focusedNodeId, nodes, onNodeDelete, setNodes, isSpacePressed, activeTool, setActiveTool]);

  const handleKeyUp = useCallback((e) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      setActiveTool(previousTool || 'select');
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

  return { handleKeyDown, handleKeyUp };
};
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useKeyboardShortcuts = ({ 
  focusedNodeId, 
  nodes, 
  onDeleteNode, 
  setNodes,
  setNodeToDelete,
  setShowDeleteConfirmation 
}) => {
  return useCallback((e) => {
    if (e.key === 'Delete' && focusedNodeId) {
      e.preventDefault();
      setNodeToDelete(focusedNodeId);
      setShowDeleteConfirmation(true);
    }
    
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'backspace':
          if (focusedNodeId) {
            e.preventDefault();
            setNodeToDelete(focusedNodeId);
            setShowDeleteConfirmation(true);
          }
          break;
        default:
          break;
      }
    }
  }, [focusedNodeId, setNodeToDelete, setShowDeleteConfirmation]);
};
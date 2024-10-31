import { useEffect, useCallback } from 'react';

export const useNodeKeyboardNavigation = ({ 
  nodes, 
  focusedNodeId, 
  onNodeFocus,
  selectedNodes 
}) => {
  const handleKeyDown = useCallback((e) => {
    if (!nodes.length) return;

    const currentIndex = nodes.findIndex(node => node.id === focusedNodeId);
    let nextIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex < nodes.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : nodes.length - 1;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = nodes.length - 1;
        break;
      default:
        return;
    }

    if (nextIndex !== undefined) {
      const nextNode = nodes[nextIndex];
      if (nextNode) {
        onNodeFocus(nextNode.id);
        const element = document.querySelector(`[data-node-id="${nextNode.id}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [nodes, focusedNodeId, onNodeFocus]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
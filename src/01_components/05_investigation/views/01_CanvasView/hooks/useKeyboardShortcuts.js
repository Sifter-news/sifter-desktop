import { useCallback } from 'react';
import { toast } from 'sonner';
import { copyNode, pasteNode } from '@/utils/clipboardUtils';

export const useKeyboardShortcuts = ({
  focusedNodeId,
  nodes,
  onDeleteNode,
  setNodes,
  setNodeToDelete,
  setShowDeleteConfirmation
}) => {
  return useCallback((e) => {
    if (focusedNodeId && (e.key === 'Delete' || e.key === 'Backspace')) {
      const nodeToDelete = nodes.find(node => node.id === focusedNodeId);
      if (nodeToDelete) {
        if (nodeToDelete.type === 'ai') {
          setNodeToDelete(nodeToDelete);
          setShowDeleteConfirmation(true);
        } else {
          onDeleteNode(focusedNodeId);
          toast.success("Node deleted");
        }
      }
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
  }, [focusedNodeId, nodes, onDeleteNode, setNodes, setNodeToDelete, setShowDeleteConfirmation]);
};
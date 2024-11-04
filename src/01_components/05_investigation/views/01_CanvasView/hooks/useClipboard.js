import { useEffect } from 'react';
import { toast } from 'sonner';

export const useClipboard = ({ nodes, focusedNodeId, onAddNode, canvasRef, position, zoom }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && focusedNodeId) {
        const nodeToCopy = nodes.find(node => node.id === focusedNodeId);
        if (nodeToCopy) {
          const { id, x, y, ...nodeData } = nodeToCopy;
          localStorage.setItem('clipboard-node', JSON.stringify(nodeData));
          toast.success('Node copied to clipboard');
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        const clipboardData = localStorage.getItem('clipboard-node');
        if (clipboardData) {
          const nodeData = JSON.parse(clipboardData);
          const rect = canvasRef.current.getBoundingClientRect();
          const x = (window.innerWidth / 2 - rect.left - position.x) / zoom;
          const y = (window.innerHeight / 2 - rect.top - position.y) / zoom;
          
          onAddNode({
            ...nodeData,
            x,
            y
          });
          toast.success('Node pasted from clipboard');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, focusedNodeId, zoom, position, onAddNode, canvasRef]);
};
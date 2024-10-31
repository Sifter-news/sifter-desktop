import { useState } from 'react';

export const useNodeSelection = ({ nodes, onNodeFocus }) => {
  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleNodeSelect = (nodeId, event) => {
    let newSelection = [];

    if (event?.shiftKey && selectedNodes.length > 0) {
      const lastSelectedIndex = nodes.findIndex(n => n.id === selectedNodes[selectedNodes.length - 1]);
      const currentIndex = nodes.findIndex(n => n.id === nodeId);
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      newSelection = nodes.slice(start, end + 1).map(n => n.id);
    } else if (event?.metaKey || event?.ctrlKey) {
      newSelection = selectedNodes.includes(nodeId)
        ? selectedNodes.filter(id => id !== nodeId)
        : [...selectedNodes, nodeId];
    } else {
      newSelection = [nodeId];
    }

    setSelectedNodes(newSelection);
    onNodeFocus(nodeId);
  };

  return {
    selectedNodes,
    handleNodeSelect
  };
};
import { useState, useCallback } from 'react';
import { createNode, updateNode, deleteNode } from '@/utils/nodeUtils';

export const useNodes = (initialNodes = []) => {
  const [nodes, setNodes] = useState(initialNodes);

  const addNode = useCallback(async (nodeData, projectId) => {
    const newNode = await createNode(nodeData, projectId);
    setNodes(prev => [...prev, newNode]);
    return newNode;
  }, []);

  const updateNodeById = useCallback(async (nodeId, updates) => {
    await updateNode(nodeId, updates);
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const deleteNodeById = useCallback(async (nodeId) => {
    await deleteNode(nodeId);
    setNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const updateNodePosition = useCallback((nodeId, position) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, ...position } : node
    ));
  }, []);

  return {
    nodes,
    setNodes,
    addNode,
    updateNodeById,
    deleteNodeById,
    updateNodePosition
  };
};
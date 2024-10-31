import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import SearchInput from './SearchInput';
import NodeList from './NodeList';
import { useDebug } from '@/contexts/DebugContext';
import { toast } from 'sonner';
import AIChatPanel from '../ai/AIChatPanel';
import NodeEditDialog from '../node/NodeEditDialog';
import { deleteNode, updateNode } from '@/utils/nodeOperations';

const NodeNavigator = ({ 
  nodes = [], 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode,
  onAIConversation,
  focusedNodeId,
  onDeleteNode 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { setDebugData } = useDebug();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!nodes.length) return;

      const currentIndex = nodes.findIndex(node => node.id === focusedNodeId);
      let nextIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'Tab':
          if (!e.shiftKey) {
            e.preventDefault();
            nextIndex = currentIndex < nodes.length - 1 ? currentIndex + 1 : 0;
          }
          break;
        case 'ArrowUp':
        case 'Tab':
          if (e.shiftKey) {
            e.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : nodes.length - 1;
          }
          break;
        default:
          return;
      }

      if (nextIndex !== undefined) {
        const nextNode = nodes[nextIndex];
        if (nextNode) {
          onNodeFocus(nextNode.id);
          setSelectedNodes([nextNode.id]);
          // Focus the element
          const element = document.querySelector(`[data-node-id="${nextNode.id}"]`);
          element?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nodes, focusedNodeId, onNodeFocus]);

  const handleNodeDelete = async (nodeId) => {
    try {
      await deleteNode(nodeId, () => {
        onDeleteNode(nodeId);
        setSelectedNodes(prev => prev.filter(id => id !== nodeId));
        if (focusedNodeId === nodeId) {
          onNodeFocus(null);
        }
      });
    } catch (error) {
      // Error is already handled by deleteNode
    }
  };

  const handleNodeUpdate = async (nodeId, updates) => {
    try {
      await updateNode(nodeId, updates);
      onUpdateNode(nodeId, updates);
      setEditingNode(null);
    } catch (error) {
      // Error is already handled by updateNode
    }
  };

  const handleEditNode = (node) => {
    setEditingNode(node);
  };

  const handleNodeClick = (nodeId) => {
    setSelectedNodes([nodeId]);
    onNodeFocus(nodeId);
  };

  const filteredNodes = nodes.filter(node => {
    if (!node) return false;
    const matchesSearch = (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (node.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col p-4 rounded-2xl">
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      
      <DragDropContext onDragEnd={() => {}}>
        <div className="flex-grow mt-4">
          <NodeList
            nodes={filteredNodes}
            onNodeFocus={onNodeFocus}
            selectedNodes={selectedNodes}
            handleNodeClick={handleNodeClick}
            onUpdateNode={handleNodeUpdate}
            onAIConversation={() => setIsAIChatOpen(true)}
            focusedNodeId={focusedNodeId}
            onDeleteNode={handleNodeDelete}
            onEdit={handleEditNode}
          />
        </div>
      </DragDropContext>

      {editingNode && (
        <NodeEditDialog
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          node={editingNode}
          onUpdate={handleNodeUpdate}
          onDelete={handleNodeDelete}
        />
      )}

      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialContext={
          focusedNodeId
            ? `Focused on node: ${nodes.find(n => n.id === focusedNodeId)?.title || ''}`
            : "Viewing the entire canvas"
        }
      />
    </div>
  );
};

export default NodeNavigator;
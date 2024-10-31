import React, { useState } from 'react';
import SearchInput from './SearchInput';
import NodeList from './NodeList';
import { useNodeKeyboardNavigation } from './hooks/useNodeKeyboardNavigation';
import { useNodeSelection } from './hooks/useNodeSelection';
import AIChatPanel from '../ai/AIChatPanel';
import NodeEditDialog from '../node/NodeEditDialog';
import { toast } from 'sonner';

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
  const [editingNode, setEditingNode] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const { selectedNodes, handleNodeSelect } = useNodeSelection({
    nodes,
    onNodeFocus,
    focusedNodeId
  });

  useNodeKeyboardNavigation({
    nodes,
    focusedNodeId,
    onNodeFocus,
    selectedNodes
  });

  const filteredNodes = nodes.filter(node => {
    if (!node) return false;
    return (
      (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleNodeUpdate = async (nodeId, updates) => {
    try {
      await onUpdateNode(nodeId, updates);
      setEditingNode(null);
      toast.success('Node updated successfully');
    } catch (error) {
      toast.error('Failed to update node');
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 rounded-2xl">
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      
      <div className="flex-grow mt-4">
        <NodeList
          nodes={filteredNodes}
          onNodeFocus={onNodeFocus}
          selectedNodes={selectedNodes}
          handleNodeClick={handleNodeSelect}
          onUpdateNode={handleNodeUpdate}
          onAIConversation={() => setIsAIChatOpen(true)}
          focusedNodeId={focusedNodeId}
          onDeleteNode={onDeleteNode}
          onEdit={setEditingNode}
        />
      </div>

      {editingNode && (
        <NodeEditDialog
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          node={editingNode}
          onUpdate={handleNodeUpdate}
          onDelete={onDeleteNode}
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
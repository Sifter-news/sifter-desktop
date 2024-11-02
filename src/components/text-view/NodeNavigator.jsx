import React, { useState } from 'react';
import SearchInput from './SearchInput';
import NodeList from './NodeList';
import { useNodeKeyboardNavigation } from './hooks/useNodeKeyboardNavigation';
import { useNodeSelection } from './hooks/useNodeSelection';
import AIChatPanel from '../ai/AIChatPanel';
import UnifiedNodeEditModal from '@/01_components/01_global/modals/ModalEdit_Node';
import { toast } from 'sonner';
import { supabase } from '@/config/supabase';

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

  const handleNodeDelete = async (nodeId) => {
    try {
      const { error } = await supabase
        .from('node')
        .delete()
        .eq('id', nodeId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      onDeleteNode(nodeId);
      toast.success('Node deleted successfully');
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    }
  };

  const validateNodeData = (node) => {
    const maxLength = 255; // New maximum length
    if (node.type && node.type.length > maxLength) {
      toast.error('Type field exceeds maximum length');
      return false;
    }
    if (node.visual_style && node.visual_style.length > maxLength) {
      toast.error('Visual style field exceeds maximum length');
      return false;
    }
    if (node.node_type && node.node_type.length > maxLength) {
      toast.error('Node type field exceeds maximum length');
      return false;
    }
    return true;
  };

  const handleNodeUpdate = async (nodeId, updates) => {
    if (!validateNodeData(updates)) {
      return;
    }
    
    try {
      await onUpdateNode(nodeId, updates);
      setEditingNode(null);
      toast.success('Node updated successfully');
    } catch (error) {
      toast.error('Failed to update node');
    }
  };

  const filteredNodes = nodes.filter(node => {
    if (!node) return false;
    return (
      (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
          onDeleteNode={handleNodeDelete}
          onEdit={setEditingNode}
        />
      </div>

      {editingNode && (
        <UnifiedNodeEditModal
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
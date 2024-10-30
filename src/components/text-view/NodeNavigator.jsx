import React, { useState, useRef, useEffect } from 'react';
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
  onDeleteNode,
  onNodeHover
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { setDebugData } = useDebug();

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
        <div className="flex-grow overflow-y-auto mt-4">
          <NodeList
            nodes={filteredNodes}
            onNodeFocus={onNodeFocus}
            selectedNodes={selectedNodes}
            handleNodeClick={(nodeId) => {
              setSelectedNodes([nodeId]);
              onNodeFocus(nodeId);
            }}
            onUpdateNode={handleNodeUpdate}
            onAIConversation={() => setIsAIChatOpen(true)}
            focusedNodeId={focusedNodeId}
            onDeleteNode={handleNodeDelete}
            onEdit={setEditingNode}
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
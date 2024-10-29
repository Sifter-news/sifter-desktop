import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import SearchInput from './SearchInput';
import NodeEditDialog from '../node/NodeEditDialog';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import NodeList from './NodeList';
import { useDebug } from '@/contexts/DebugContext';
import { toast } from 'sonner';
import AIChatPanel from '../ai/AIChatPanel';

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
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [editingNode, setEditingNode] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const fileInputRef = useRef(null);

  const { handleDragEnd } = useDragAndDrop(nodes, onUpdateNode);
  const { setDebugData } = useDebug();

  useEffect(() => {
    setDebugData(prev => ({
      ...prev,
      navigatorNodes: nodes
    }));
  }, [nodes, setDebugData]);

  const filteredNodes = nodes.filter(node => {
    if (!node) return false;
    const matchesSearch = (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (node.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleNodeClick = (nodeId) => {
    setCurrentIndex(nodes.findIndex(n => n.id === nodeId));
    setSelectedNodes([nodeId]);
    onNodeFocus(nodeId);
  };

  const handleNodeDelete = async (nodeId) => {
    try {
      await onDeleteNode(nodeId);
      setSelectedNodes(prev => prev.filter(id => id !== nodeId));
      if (focusedNodeId === nodeId) {
        onNodeFocus(null);
      }
      toast.success('Node deleted successfully');
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    }
  };

  const handleAIChat = () => {
    setIsAIChatOpen(true);
    const focusedNode = nodes.find(node => node.id === focusedNodeId);
    const context = focusedNode 
      ? `Focused on node: ${focusedNode.title}\n${focusedNode.description || ''}`
      : "Viewing the entire canvas";
    onAIConversation?.(context);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 rounded-2xl m-4">
      <div className="flex-1">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-grow overflow-y-auto mt-4">
          <NodeList
            nodes={filteredNodes}
            onNodeFocus={onNodeFocus}
            selectedNodes={selectedNodes}
            handleNodeClick={handleNodeClick}
            onUpdateNode={onUpdateNode}
            onAIConversation={handleAIChat}
            focusedNodeId={focusedNodeId}
            onDeleteNode={handleNodeDelete}
          />
        </div>
      </DragDropContext>

      {editingNode && (
        <NodeEditDialog
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          node={editingNode}
          onUpdate={(id, updates) => {
            onUpdateNode(id, updates);
            setEditingNode(null);
          }}
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
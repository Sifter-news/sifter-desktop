import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import SearchInput from './SearchInput';
import NodeListItem from './NodeListItem';
import NodeTypeSelector from './NodeTypeSelector';
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
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [navigatorNodes, setNavigatorNodes] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [editingNode, setEditingNode] = useState(null);
  const nodeRefs = useRef({});

  useEffect(() => {
    setNavigatorNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    if (focusedNodeId && nodeRefs.current[focusedNodeId]) {
      nodeRefs.current[focusedNodeId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
      setSelectedNodes([focusedNodeId]);
    }
  }, [focusedNodeId]);

  const handleDeleteNode = async (nodeId) => {
    try {
      await onDeleteNode(nodeId);
      toast.success('Node deleted successfully');
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    }
  };

  const filteredNodes = navigatorNodes.filter(node => {
    if (!node) return false;
    const matchesType = selectedType === 'all' || node.nodeType === selectedType;
    const matchesSearch = (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (node.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="space-y-4 mb-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <NodeTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />
      </div>

      <div className="flex-grow overflow-y-auto">
        {filteredNodes.map((node, index) => node && (
          <div 
            key={node.id}
            ref={el => nodeRefs.current[node.id] = el}
            className="mb-1"
          >
            <NodeListItem
              node={node}
              isSelected={selectedNodes.includes(node.id)}
              onSelect={(nodeId) => {
                const index = filteredNodes.findIndex(n => n.id === nodeId);
                setCurrentIndex(index);
                setSelectedNodes([nodeId]);
                onNodeFocus(nodeId);
              }}
              onFocus={onNodeFocus}
              onUpdateNode={onUpdateNode}
              onAIConversation={onAIConversation}
              isFocused={focusedNodeId === node.id || index === currentIndex}
              onEdit={setEditingNode}
              onDelete={handleDeleteNode}
            />
          </div>
        ))}
      </div>

      {editingNode && (
        <NodeEditDialog
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          node={editingNode}
          onUpdate={(id, updates) => {
            onUpdateNode(id, updates);
            setEditingNode(null);
          }}
        />
      )}
    </div>
  );
};

export default NodeNavigator;
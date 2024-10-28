import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import SearchInput from './SearchInput';
import NodeListItem from './NodeListItem';
import NodeTypeSelector from './NodeTypeSelector';
import NodeEditDialog from '../node/NodeEditDialog';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      setNavigatorNodes(prev => prev.filter(node => node.id !== nodeId));
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

  const groupedNodes = filteredNodes.reduce((acc, node) => {
    const type = node.nodeType || 'generic';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(node);
    return acc;
  }, {});

  const getNodeTypeLabel = (type) => {
    const labels = {
      'generic': 'Generic Notes',
      'node_person': 'People',
      'node_organization': 'Organizations',
      'node_object': 'Objects',
      'node_concept': 'Concepts',
      'node_location': 'Locations',
      'node_event': 'Events'
    };
    return labels[type] || type;
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="space-y-4 mb-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <NodeTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />
      </div>

      <ScrollArea className="flex-grow">
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedNodes).map(([type, nodes]) => (
            <AccordionItem value={type} key={type}>
              <AccordionTrigger className="text-sm font-medium">
                {getNodeTypeLabel(type)} ({nodes.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {nodes.map((node) => (
                    <div 
                      key={node.id}
                      ref={el => nodeRefs.current[node.id] = el}
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
                        isFocused={focusedNodeId === node.id || nodes.indexOf(node) === currentIndex}
                        onEdit={setEditingNode}
                        onDelete={handleDeleteNode}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      {editingNode && (
        <NodeEditDialog
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          node={editingNode}
          onUpdate={(id, updates) => {
            onUpdateNode(id, updates);
            setEditingNode(null);
          }}
          onDelete={handleDeleteNode}
        />
      )}
    </div>
  );
};

export default NodeNavigator;
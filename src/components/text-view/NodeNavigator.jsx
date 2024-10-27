import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import SearchInput from './SearchInput';
import NodeListItem from './NodeListItem';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NodeNavigator = ({ 
  nodes = [], 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode,
  onAIConversation,
  focusedNodeId 
}) => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [navigatorNodes, setNavigatorNodes] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
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

  const filteredNodes = navigatorNodes.filter(node => {
    if (!node) return false;
    const matchesType = selectedType === 'all' || node.nodeType === selectedType;
    const matchesSearch = (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (node.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!filteredNodes.length) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setCurrentIndex(prev => {
          const nextIndex = prev < filteredNodes.length - 1 ? prev + 1 : 0;
          const nodeId = filteredNodes[nextIndex].id;
          setSelectedNodes([nodeId]);
          onNodeFocus(nodeId);
          return nextIndex;
        });
      }
      
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setCurrentIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : filteredNodes.length - 1;
          const nodeId = filteredNodes[nextIndex].id;
          setSelectedNodes([nodeId]);
          onNodeFocus(nodeId);
          return nextIndex;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredNodes, onNodeFocus]);

  const handleAddNode = () => {
    const position = {
      x: Math.random() * 500,
      y: Math.random() * 500
    };

    onAddNode({
      id: Date.now().toString(),
      type: 'text',
      title: `New Node ${nodes.length + 1}`,
      description: '',
      x: position.x,
      y: position.y
    });
  };

  const handleNodeSelect = (nodeId, event) => {
    const index = filteredNodes.findIndex(node => node.id === nodeId);
    setCurrentIndex(index);
    
    setSelectedNodes(prev => {
      if (event.altKey) {
        if (prev.includes(nodeId)) {
          return prev.filter(id => id !== nodeId);
        }
        return [...prev, nodeId];
      }
      return [nodeId];
    });
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-white/30 backdrop-blur-md">
      <div className="space-y-4 mb-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>General</SelectLabel>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="generic">Generic Node</SelectItem>
              <SelectItem value="group">Groups</SelectItem>
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>People & Organizations</SelectLabel>
              <SelectItem value="node_person">Person</SelectItem>
              <SelectItem value="node_organization">Organization</SelectItem>
              <SelectItem value="node_group">Group</SelectItem>
              <SelectItem value="node_network">Network</SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Places & Locations</SelectLabel>
              <SelectItem value="node_location">Location</SelectItem>
              <SelectItem value="node_address">Address</SelectItem>
              <SelectItem value="node_building">Building</SelectItem>
              <SelectItem value="node_area">Area</SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Events & Time</SelectLabel>
              <SelectItem value="node_event">Event</SelectItem>
              <SelectItem value="node_meeting">Meeting</SelectItem>
              <SelectItem value="node_incident">Incident</SelectItem>
              <SelectItem value="node_timeline">Timeline</SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Objects & Items</SelectLabel>
              <SelectItem value="node_object">Object</SelectItem>
              <SelectItem value="node_document">Document</SelectItem>
              <SelectItem value="node_evidence">Evidence</SelectItem>
              <SelectItem value="node_asset">Asset</SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Concepts & Information</SelectLabel>
              <SelectItem value="node_concept">Concept</SelectItem>
              <SelectItem value="node_topic">Topic</SelectItem>
              <SelectItem value="node_theory">Theory</SelectItem>
              <SelectItem value="node_information">Information</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-grow overflow-y-auto">
        {filteredNodes.map((node, index) => node && (
          <div 
            key={node.id}
            ref={el => nodeRefs.current[node.id] = el}
          >
            <NodeListItem
              node={node}
              isSelected={selectedNodes.includes(node.id)}
              onSelect={(nodeId) => handleNodeSelect(nodeId, window.event)}
              onFocus={onNodeFocus}
              onUpdateNode={onUpdateNode}
              onAIConversation={onAIConversation}
              isFocused={focusedNodeId === node.id || index === currentIndex}
            />
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleAddNode} 
        className="mt-4 w-full flex items-center justify-center gap-2"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        Add Node
      </Button>
    </div>
  );
};

export default NodeNavigator;
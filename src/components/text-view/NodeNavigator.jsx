import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import SearchInput from './SearchInput';
import NodeListItem from './NodeListItem';
import NodeDropdownMenu from './NodeDropdownMenu';
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
  focusedNodeId,
  onEditNode 
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
              onEditNode={onEditNode}
            />
          </div>
        ))}
      </div>
      
      <Button 
        onClick={onAddNode} 
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
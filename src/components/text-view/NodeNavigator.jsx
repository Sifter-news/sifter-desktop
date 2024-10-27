import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Navigator from '../Navigator';
import { MoreVertical } from 'lucide-react';
import SearchInput from './SearchInput';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NodeNavigator = ({ nodes, onUpdateNode, onNodeFocus, selectedNode, onAddNode }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [navigatorNodes, setNavigatorNodes] = useState(nodes);

  useEffect(() => {
    setNavigatorNodes(nodes);
  }, [nodes]);

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

  const handleNodeUpdate = (updatedNodes) => {
    setNavigatorNodes(updatedNodes);
    onUpdateNode(updatedNodes);
  };

  const filteredNodes = navigatorNodes
    .filter(node => {
      const matchesType = selectedType === 'all' || node.nodeType === selectedType;
      const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold opacity-15">Node Navigator</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleAddNode}>
              Add Node
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-4 mb-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="generic">Generic Node</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectItem value="node_person">Person</SelectItem>
              <SelectItem value="node_organization">Organization</SelectItem>
              <SelectItem value="node_object">Object</SelectItem>
              <SelectItem value="node_concept">Concept</SelectItem>
              <SelectItem value="node_location">Location</SelectItem>
              <SelectItem value="node_event">Event</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-grow overflow-y-auto">
        <Navigator 
          items={filteredNodes} 
          setItems={handleNodeUpdate}
          onDocumentClick={(node) => onNodeFocus(node.id)}
          focusedDocument={selectedNode}
        />
      </div>
      <Button onClick={handleAddNode} className="mt-4 w-full">Add Node</Button>
    </div>
  );
};

export default NodeNavigator;
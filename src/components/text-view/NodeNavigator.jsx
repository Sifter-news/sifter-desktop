import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Navigator from '../Navigator';
import { MoreVertical, Plus } from 'lucide-react';
import SearchInput from './SearchInput';
import NodeActions from './NodeActions';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NodeNavigator = ({ 
  nodes, 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode,
  onAIConversation 
}) => {
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
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/default-image.png" alt="Navigator Avatar" />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold opacity-15">Node Navigator</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Empty dropdown menu for future options */}
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
        {filteredNodes.map(node => (
          <div key={node.id} className="group flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
            <div 
              className="flex-grow cursor-pointer"
              onClick={() => onNodeFocus(node.id)}
            >
              <div className="font-medium">{node.title}</div>
              <div className="text-sm text-gray-500">{node.description}</div>
            </div>
            <NodeActions 
              node={node} 
              onUpdateNode={onUpdateNode}
              onAIConversation={onAIConversation}
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
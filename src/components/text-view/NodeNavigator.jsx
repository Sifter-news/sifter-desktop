import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, FolderPlus } from 'lucide-react';
import SearchInput from './SearchInput';
import NodeActions from './NodeActions';
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
import { toast } from 'sonner';

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
  const [selectedNodes, setSelectedNodes] = useState([]);

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

  const handleNodeSelect = (nodeId) => {
    setSelectedNodes(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(id => id !== nodeId);
      }
      return [...prev, nodeId];
    });
  };

  const handleCreateGroup = () => {
    if (selectedNodes.length < 2) {
      toast.error('Select at least 2 nodes to create a group');
      return;
    }

    const groupPosition = {
      x: Math.random() * 500,
      y: Math.random() * 500
    };

    const groupNode = {
      id: Date.now().toString(),
      type: 'group',
      title: `Group (${selectedNodes.length} nodes)`,
      description: 'Grouped nodes',
      x: groupPosition.x,
      y: groupPosition.y,
      children: selectedNodes
    };

    onAddNode(groupNode);
    setSelectedNodes([]);
    toast.success('Group created successfully');
  };

  const getNodeTypeIcon = (nodeType) => {
    const types = {
      node_person: '👤',
      node_organization: '🏢',
      node_object: '📦',
      node_concept: '💡',
      node_location: '📍',
      node_event: '📅',
      group: '📁',
      generic: '📝'
    };
    return types[nodeType] || '📝';
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
        <div className="flex gap-2">
          {selectedNodes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateGroup}
              className="flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              Create Group ({selectedNodes.length})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleAddNode}>
                Add Node
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateGroup}>
                Create Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              <SelectItem value="group">Groups</SelectItem>
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
          <div 
            key={node.id} 
            className={`group flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg ${
              selectedNodes.includes(node.id) ? 'bg-blue-50 ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleNodeSelect(node.id)}
          >
            <div 
              className="flex items-center flex-grow cursor-pointer gap-3"
              onClick={(e) => {
                e.stopPropagation();
                onNodeFocus(node.id);
              }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/default-image.png" alt={node.title} />
                <AvatarFallback>{getNodeTypeIcon(node.nodeType)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{node.title}</div>
                <div className="text-sm text-gray-500">
                  {node.description}
                  {node.type === 'group' && ` (${node.children?.length || 0} nodes)`}
                </div>
              </div>
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
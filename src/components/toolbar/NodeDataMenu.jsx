import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, User, Building2, Package, MapPin, Brain, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NodeDataMenu = ({ onAddNode, selectedStyle }) => {
  const nodeTypes = [
    { id: 'generic', icon: FileText, label: 'Note' },
    { id: 'node_person', icon: User, label: 'Person' },
    { id: 'node_organization', icon: Building2, label: 'Organisation' },
    { id: 'node_object', icon: Package, label: 'Object' },
    { id: 'node_location', icon: MapPin, label: 'Location' },
    { id: 'node_concept', icon: Brain, label: 'Concept' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] opacity-50 flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Add Node</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-white" align="top">
        {nodeTypes.map(type => (
          <DropdownMenuItem 
            key={type.id}
            onClick={() => onAddNode(type.id)}
            className="flex items-center gap-2"
          >
            <type.icon className="h-4 w-4" />
            <span>{type.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeDataMenu;
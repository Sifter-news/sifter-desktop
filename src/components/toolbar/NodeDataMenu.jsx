import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, User, Building2, Package, Brain, MapPin, Calendar, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nodeTypes = {
  generic: { label: "Generic Note", icon: FileText },
  node_person: { label: "Person", icon: User },
  node_organization: { label: "Organization", icon: Building2 },
  node_object: { label: "Object", icon: Package },
  node_concept: { label: "Concept", icon: Brain },
  node_location: { label: "Location", icon: MapPin },
  node_event: { label: "Event", icon: Calendar }
};

const NodeDataMenu = ({ onAddNode, selectedStyle }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 rounded-lg text-white hover:text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Add Node</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-white" align="top">
        {Object.entries(nodeTypes).map(([value, { label, icon: Icon }]) => (
          <DropdownMenuItem 
            key={value}
            onClick={() => onAddNode(value)}
            className="flex items-center gap-2 hover:text-white"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeDataMenu;
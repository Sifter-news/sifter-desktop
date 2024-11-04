import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, User, Building2, Package, Brain, MapPin, Calendar, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const nodeTypes = {
  generic: { label: "Note", icon: FileText, shortcut: "N" },
  node_person: { label: "Person", icon: User, shortcut: "P" },
  node_organization: { label: "Organization", icon: Building2, shortcut: "O" },
  node_object: { label: "Object", icon: Package, shortcut: "B" },
  node_concept: { label: "Concept", icon: Brain, shortcut: "C" },
  node_location: { label: "Location", icon: MapPin, shortcut: "L" },
  node_event: { label: "Event", icon: Calendar, shortcut: "E" }
};

const NodeDataMenu = ({ onAddNode, selectedStyle }) => {
  const generateRandomPosition = () => ({
    x: (Math.random() * 100) - 50,
    y: (Math.random() * 100) - 50,
    z: 0
  });

  const handleAddNode = (nodeType) => {
    const position = generateRandomPosition();
    onAddNode({
      nodeType,
      visualStyle: selectedStyle,
      position_x: position.x,
      position_y: position.y,
      position_z: position.z,
      title: 'New Node',
      description: ''
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:text-white hover:bg-white/10 bg-white/[0.0625]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            {Object.entries(nodeTypes).map(([value, { label, icon: Icon, shortcut }]) => (
              <DropdownMenuItem 
                key={value}
                onClick={() => handleAddNode(value)}
                className="flex items-center gap-2 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent side="top" className="bg-black text-white border-white/10">
          <p>Add New Node (N)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NodeDataMenu;
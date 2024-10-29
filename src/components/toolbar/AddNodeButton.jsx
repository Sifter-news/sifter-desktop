import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Database, FileText, User, Building2, Package, Brain, MapPin, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AddNodeButton = ({ handleAddNodeWithStyle }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625]"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-white" align="top">
        <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'data_node')}>
          <Database className="h-4 w-4 mr-2" />
          Data Node
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'generic')}>
          <FileText className="h-4 w-4 mr-2" />
          Generic Note
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_person')}>
          <User className="h-4 w-4 mr-2" />
          Person
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_organization')}>
          <Building2 className="h-4 w-4 mr-2" />
          Organization
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_object')}>
          <Package className="h-4 w-4 mr-2" />
          Object
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_concept')}>
          <Brain className="h-4 w-4 mr-2" />
          Concept
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_location')}>
          <MapPin className="h-4 w-4 mr-2" />
          Location
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_event')}>
          <Calendar className="h-4 w-4 mr-2" />
          Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddNodeButton;
import React from 'react';
import { Button } from "@/components/ui/button";
import { MousePointer2, Move3d, Orbit, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ToolSelectMenu = ({ activeTool, setActiveTool, viewMode }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 rounded-lg text-white hover:bg-white/10 bg-white/5 flex items-center gap-1"
        >
          {activeTool === 'select' ? <MousePointer2 className="h-4 w-4" /> : (viewMode === '3d' ? <Orbit className="h-4 w-4" /> : <Move3d className="h-4 w-4" />)}
          <span>{activeTool === 'select' ? 'Select' : 'Pan'}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-white" align="top">
        <DropdownMenuItem onClick={() => setActiveTool('select')}>
          <MousePointer2 className="h-4 w-4 mr-2" />
          Select & Move
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setActiveTool('pan')}>
          {viewMode === '3d' ? <Orbit className="h-4 w-4 mr-2" /> : <Move3d className="h-4 w-4 mr-2" />}
          {viewMode === '3d' ? "Pan & Orbit" : "Pan"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToolSelectMenu;
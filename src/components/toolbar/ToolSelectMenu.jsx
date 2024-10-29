import React from 'react';
import { Button } from "@/components/ui/button";
import { MousePointer2, Move3d, Orbit, ChevronDown, View, Axis3D } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const ToolSelectMenu = ({ activeTool, setActiveTool, viewMode, onViewModeChange }) => {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1 [&>svg]:text-white hover:[&>svg]:text-white"
          >
            {activeTool === 'select' ? (
              <MousePointer2 className="h-4 w-4" />
            ) : (
              viewMode === '3d' ? <Orbit className="h-4 w-4" /> : <Move3d className="h-4 w-4" />
            )}
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1 [&>svg]:text-white hover:[&>svg]:text-white"
          >
            {viewMode === '3d' ? (
              <Axis3D className="h-4 w-4" />
            ) : (
              <View className="h-4 w-4" />
            )}
            <span className="bg-white/10 px-2 py-0.5 rounded text-sm">
              {viewMode === '3d' ? '3D' : '2D'}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black text-white" align="top">
          <DropdownMenuItem onClick={() => onViewModeChange('2d')}>
            <View className="h-4 w-4 mr-2" />
            2D View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewModeChange('3d')}>
            <Axis3D className="h-4 w-4 mr-2" />
            3D View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ToolSelectMenu;
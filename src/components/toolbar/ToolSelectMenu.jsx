import React from 'react';
import { Button } from "@/components/ui/button";
import { MousePointer2, Move3d, Orbit, LayoutGrid, Axis3D, ChevronDown } from 'lucide-react';

const ToolSelectMenu = ({ activeTool, setActiveTool, viewMode, setViewMode }) => {
  const handleToolToggle = () => {
    setActiveTool(activeTool === 'select' ? 'pan' : 'select');
  };

  const handleViewToggle = () => {
    setViewMode(viewMode === '2d' ? '3d' : '2d');
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleToolToggle}
        className="h-8 w-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] flex items-center justify-center"
      >
        {activeTool === 'select' ? (
          <div className="flex items-center">
            <MousePointer2 className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </div>
        ) : (
          <div className="flex items-center">
            {viewMode === '3d' ? <Orbit className="h-4 w-4" /> : <Move3d className="h-4 w-4" />}
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </div>
        )}
      </Button>

      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleViewToggle}
        className="h-8 w-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] flex items-center justify-center"
      >
        {viewMode === '3d' ? (
          <div className="flex items-center">
            <Axis3D className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </div>
        ) : (
          <div className="flex items-center">
            <LayoutGrid className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </div>
        )}
      </Button>
    </div>
  );
};

export default ToolSelectMenu;
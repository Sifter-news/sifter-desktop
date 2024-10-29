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
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleToolToggle}
          className="h-8 w-8 rounded-lg text-white hover:bg-white/10 hover:text-white bg-white/[0.0625] flex items-center justify-center"
        >
          {activeTool === 'select' ? (
            <MousePointer2 className="h-6 w-6" />
          ) : (
            viewMode === '3d' ? <Orbit className="h-6 w-6" /> : <Move3d className="h-6 w-6" />
          )}
        </Button>
        <ChevronDown className="h-2 w-2 ml-0.5 text-white" />
      </div>

      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleViewToggle}
          className="h-8 w-8 rounded-lg text-white hover:bg-white/10 hover:text-white bg-white/[0.0625] flex items-center justify-center"
        >
          {viewMode === '3d' ? (
            <Axis3D className="h-6 w-6" />
          ) : (
            <LayoutGrid className="h-6 w-6" />
          )}
        </Button>
        <ChevronDown className="h-2 w-2 ml-0.5 text-white" />
      </div>
    </div>
  );
};

export default ToolSelectMenu;
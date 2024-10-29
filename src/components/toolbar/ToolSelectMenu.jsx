import React from 'react';
import { Button } from "@/components/ui/button";
import { MousePointer2, Move3d, Orbit, Grid2x2, Axis3D } from 'lucide-react';

const ToolSelectMenu = ({ activeTool, setActiveTool, viewMode, onViewModeChange }) => {
  const handleToolToggle = () => {
    setActiveTool(activeTool === 'select' ? 'pan' : 'select');
  };

  const handleViewToggle = () => {
    onViewModeChange(viewMode === '2d' ? '3d' : '2d');
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleToolToggle}
        className={`h-8 px-2 rounded-lg text-white hover:bg-white/10 ${
          activeTool === 'select' ? 'bg-blue-600' : 'bg-white/[0.0625]'
        }`}
      >
        {activeTool === 'select' ? (
          <MousePointer2 className="h-4 w-4" />
        ) : (
          viewMode === '3d' ? <Orbit className="h-4 w-4" /> : <Move3d className="h-4 w-4" />
        )}
      </Button>

      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleViewToggle}
        className={`h-8 px-2 rounded-lg text-white hover:bg-white/10 ${
          viewMode === '3d' ? 'bg-blue-600' : 'bg-white/[0.0625]'
        }`}
      >
        {viewMode === '3d' ? (
          <Axis3D className="h-4 w-4" />
        ) : (
          <Grid2x2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ToolSelectMenu;
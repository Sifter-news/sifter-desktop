import React from 'react';
import { Button } from "@/components/ui/button";
import { MousePointer2, Move3d, Orbit, LayoutGrid, Axis3D } from 'lucide-react';

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
        className="h-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1 [&>svg]:text-white hover:[&>svg]:text-white"
      >
        {activeTool === 'select' ? (
          <>
            <MousePointer2 className="h-4 w-4" />
            <span>Select</span>
          </>
        ) : (
          <>
            {viewMode === '3d' ? <Orbit className="h-4 w-4" /> : <Move3d className="h-4 w-4" />}
            <span>{viewMode === '3d' ? 'Pan & Orbit' : 'Pan'}</span>
          </>
        )}
      </Button>

      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleViewToggle}
        className="h-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1 [&>svg]:text-white hover:[&>svg]:text-white"
      >
        {viewMode === '3d' ? (
          <>
            <Axis3D className="h-4 w-4" />
            <span className="bg-white/10 px-2 py-0.5 rounded text-sm">3D</span>
          </>
        ) : (
          <>
            <LayoutGrid className="h-4 w-4" />
            <span className="text-sm">2D</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ToolSelectMenu;
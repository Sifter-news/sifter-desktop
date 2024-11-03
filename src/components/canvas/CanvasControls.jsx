import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Move, MousePointer2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CanvasControls = ({ zoom, handleZoom, setPosition, activeTool, setActiveTool }) => {
  const resetView = () => {
    setPosition({ x: 0, y: 0 });
    handleZoom(-zoom + 1); // Reset to zoom level 1
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2">
      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleZoom(0.1)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom In (⌘+)</p>
            </TooltipContent>
          </Tooltip>

          <div className="px-2 py-1 text-center text-sm text-gray-600 select-none">
            {Math.round(zoom * 100)}%
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleZoom(-0.1)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom Out (⌘-)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={resetView}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Reset View (⌘0)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'select' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setActiveTool('select')}
              >
                <MousePointer2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Select Tool (V)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'pan' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setActiveTool('pan')}
              >
                <Move className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Pan Tool (H)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CanvasControls;
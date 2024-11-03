import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MousePointer2, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CanvasControls = ({ 
  activeTool, 
  setActiveTool, 
  zoom,
  handleZoom 
}) => {
  const zoomIn = () => handleZoom(0.1);
  const zoomOut = () => handleZoom(-0.1);
  const resetZoom = () => handleZoom(1 - zoom);

  return (
    <div className="fixed bottom-24 right-4 bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-0.75 border border-white/20">
      <div className="bg-black/90 rounded-xl px-1.5 py-2 flex flex-col items-center space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-lg ${
                  activeTool === 'select' ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTool('select')}
              >
                <MousePointer2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Select (V)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-lg ${
                  activeTool === 'pan' ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTool('pan')}
              >
                <Move className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Pan (H)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="w-6 bg-white/20" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                onClick={zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom In (⌘+)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                onClick={zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom Out (⌘-)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                onClick={resetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Reset Zoom (⌘0)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CanvasControls;
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ZOOM_LEVELS = [
  { value: 0.125, label: '12.5%' },
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 1, label: '100%' },
  { value: 2, label: '200%' },
  { value: 4, label: '400%' },
];

const ZoomLevelMenu = ({ zoom, handleZoom }) => {
  const zoomPercentage = Math.round(100 * zoom);
  
  const setZoomLevel = (newZoom) => {
    const delta = newZoom - zoom;
    handleZoom(delta);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 rounded-lg text-white hover:text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1.5"
              >
                {zoomPercentage}%
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            {ZOOM_LEVELS.map((level) => (
              <DropdownMenuItem
                key={level.value}
                onClick={() => setZoomLevel(level.value)}
                className="flex items-center justify-between hover:text-white"
              >
                <span>{level.label}</span>
                {level.value === 1 && <span className="text-xs text-gray-400">⌘0</span>}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => setZoomLevel(1)}
              className="flex items-center gap-2 hover:text-white border-t border-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Zoom</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent side="top" className="bg-black text-white border-white/10">
          <p>Zoom Level (⌘+ / ⌘-)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ZoomLevelMenu;
import React from 'react';
import { Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DebugFocusSection = ({ hoveredElement }) => {
  if (!hoveredElement) {
    return (
      <div className="p-4 border-b border-white/10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-white/60">
                <Target className="h-4 w-4" />
                <p className="text-sm">No element focused</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-black/90 text-white">
              <p>Shows information about the currently focused UI element</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-white/10">
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-medium text-white">Focused Element</h3>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-black/90 text-white">
              <p>Details about the currently focused component or element</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="bg-black/50 p-2 rounded">
          <p className="text-xs font-medium text-blue-400">{hoveredElement.component}</p>
          {hoveredElement.metadata && (
            <div className="mt-2 space-y-1.5 border-l-2 border-white/10 pl-2">
              {Object.entries(hoveredElement.metadata).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[100px,1fr] gap-2 text-xs">
                  <span className="text-white/60">{key}:</span>
                  <span className="text-white/90 break-all">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugFocusSection;
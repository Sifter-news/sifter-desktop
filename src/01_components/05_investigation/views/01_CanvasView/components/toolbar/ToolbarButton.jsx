import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ToolbarButton = ({ 
  icon: Icon, 
  label, 
  shortcut, 
  onClick, 
  isActive,
  className,
  draggable,
  onDragStart 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-lg ${
              isActive ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'
            } ${className}`}
            onClick={onClick}
            draggable={draggable}
            onDragStart={onDragStart}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{label} {shortcut && `(${shortcut})`}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolbarButton;
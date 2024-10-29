import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ToolbarButton = ({ 
  icon, 
  label, 
  onClick, 
  isActive, 
  onDragStart, 
  draggable,
  activeClassName = 'bg-blue-500 bg-opacity-50'
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost" 
          className={`rounded-full transition-all duration-200 ${isActive ? activeClassName : ''}`}
          onClick={onClick}
          onDragStart={onDragStart}
          draggable={draggable}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default ToolbarButton;
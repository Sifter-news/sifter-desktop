import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NodeTooltip = ({ node, children, onView }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild onClick={() => onView(node)}>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium">{node.title}</div>
            {node.description && (
              <div className="text-gray-500">{node.description}</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NodeTooltip;
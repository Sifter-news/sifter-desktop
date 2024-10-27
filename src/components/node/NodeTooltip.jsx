import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NodeTooltip = ({ node, onView, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="top" className="flex gap-2 bg-black text-white border-black p-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => onView(node)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Node
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NodeTooltip;
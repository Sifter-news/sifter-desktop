import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TooltipButtons from './TooltipButtons';

const NodeTooltip = ({ node, showTooltip, onAIConversation, onDelete, onUpdateNode }) => {
  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <div className="absolute inset-0" />
        </TooltipTrigger>
        <TooltipContent side="top">
          <TooltipButtons
            node={node}
            onAIConversation={onAIConversation}
            onDelete={onDelete}
            onUpdateNode={onUpdateNode}
            handleStyleChange={(style) => onUpdateNode(node.id, { visualStyle: style })}
            handleTypeChange={(type) => onUpdateNode(node.id, { nodeType: type })}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NodeTooltip;
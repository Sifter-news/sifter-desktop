import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageCircle, Layout, Type, Trash2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const NodeTooltip = ({ 
  isOpen, 
  children, 
  node, 
  onStyleChange, 
  onTypeChange, 
  onAIConversation, 
  onDelete 
}) => {
  const styles = {
    compact: "Compact",
    expanded: "Expanded",
    postit: "Post-it"
  };

  const nodeTypes = {
    generic: "Generic Note",
    node_person: "Person",
    node_organization: "Organization",
    node_object: "Object",
    node_concept: "Concept",
    node_location: "Location",
    node_event: "Event"
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-black text-white border-black p-2"
        >
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                  <Layout className="h-4 w-4 mr-2" />
                  {styles[node.visualStyle] || 'Default Style'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-32">
                <div className="flex flex-col space-y-1">
                  {Object.entries(styles).map(([value, label]) => (
                    <Button
                      key={value}
                      variant="ghost"
                      size="sm"
                      onClick={() => onStyleChange(value)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="bg-white/20" />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                  <Type className="h-4 w-4 mr-2" />
                  {nodeTypes[node.nodeType] || 'Generic Note'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <div className="flex flex-col space-y-1">
                  {Object.entries(nodeTypes).map(([value, label]) => (
                    <Button
                      key={value}
                      variant="ghost"
                      size="sm"
                      onClick={() => onTypeChange(value)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="bg-white/20" />

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-purple-700 bg-purple-600"
              onClick={() => onAIConversation(node)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              AI
            </Button>

            <Separator orientation="vertical" className="bg-white/20" />

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-red-700"
              onClick={() => onDelete(node.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NodeTooltip;
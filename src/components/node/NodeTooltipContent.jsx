import React from 'react';
import { Button } from "@/components/ui/button";
import { Layout, Type, MessageCircle, Trash2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NodeTooltipContent = ({ node, onStyleChange, onTypeChange, onAIConversation, onDelete }) => {
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
    <div className="flex gap-2 bg-black text-white border-black p-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Layout className="h-4 w-4 mr-2" />
            Style
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

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Type className="h-4 w-4 mr-2" />
            Type
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

      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-purple-700 bg-purple-600"
        onClick={() => onAIConversation(node)}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        AI
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-gray-800"
        onClick={() => onDelete(node.id)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default NodeTooltipContent;
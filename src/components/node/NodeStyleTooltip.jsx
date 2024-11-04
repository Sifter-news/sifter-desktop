import React from 'react';
import { Button } from "@/components/ui/button";
import { Layout, Type, MessageCircle, Pencil } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NodeStyleTooltip = ({
  position,
  onStyleChange,
  onTextSizeChange,
  onAlignmentChange,
  onTypeChange,
  onColorChange,
  onEdit,
  onAIChat
}) => {
  return (
    <div 
      className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg shadow-lg"
      style={{ zIndex: 'auto' }} // Remove any explicit z-index to match node layering
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Layout className="h-4 w-4 mr-2" />
            Style
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStyleChange('default')}
            >
              Default
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStyleChange('compact')}
            >
              Compact
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStyleChange('postit')}
            >
              Post-it
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Type className="h-4 w-4 mr-2" />
            Type
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange('generic')}
            >
              Generic Note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange('node_person')}
            >
              Person
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange('node_organization')}
            >
              Organization
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange('node_object')}
            >
              Object
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange('node_concept')}
            >
              Concept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange('node_location')}
            >
              Location
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange('node_event')}
            >
              Event
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-purple-700 bg-purple-600"
        onClick={onAIChat}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        AI
      </Button>
    </div>
  );
};

export default NodeStyleTooltip;
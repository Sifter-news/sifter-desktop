import React from 'react';
import { Button } from "@/components/ui/button";
import { Layout, Type, MessageCircle, Pencil, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const colors = {
  white: { label: 'White', class: 'bg-white' },
  yellow: { label: 'Yellow', class: 'bg-yellow-100' },
  blue: { label: 'Blue', class: 'bg-blue-100' },
  green: { label: 'Green', class: 'bg-green-100' },
  pink: { label: 'Pink', class: 'bg-pink-100' },
  purple: { label: 'Purple', class: 'bg-purple-100' },
  orange: { label: 'Orange', class: 'bg-orange-100' },
};

const NodeStyleTooltip = ({
  position,
  onStyleChange,
  onTextSizeChange,
  onAlignmentChange,
  onTypeChange,
  onColorChange,
  onEdit,
  onAIChat,
  node
}) => {
  const currentColor = node?.color || 'bg-white';
  
  return (
    <div 
      className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg shadow-lg"
      style={{ zIndex: 'auto' }}
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
            <div className={`w-4 h-4 rounded-full mr-2 ${currentColor}`} />
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32">
          <div className="flex flex-col space-y-1">
            {Object.entries(colors).map(([key, { label, class: bgClass }]) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                onClick={() => onColorChange(bgClass)}
                className="justify-start"
              >
                <div className={`w-4 h-4 rounded-full mr-2 ${bgClass}`} />
                {label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Layout className="h-4 w-4 mr-2" />
            Style
            <ChevronDown className="h-4 w-4 ml-1" />
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
            <ChevronDown className="h-4 w-4 ml-1" />
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
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MessageCircle, Type, Database, Palette } from 'lucide-react';

const NodeRenderer = ({ node, onDragStart, zoom, onNodeUpdate, onFocus, isFocused }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleVisualTypeChange = (value) => {
    onNodeUpdate(node.id, { visualType: value });
  };

  const handleDataTypeChange = (value) => {
    onNodeUpdate(node.id, { type: value });
  };

  const handleColorChange = (value) => {
    onNodeUpdate(node.id, { color: value });
  };

  const handleAIClick = () => {
    onFocus(node.id);
  };

  const renderNodeContent = () => {
    const baseClasses = `w-full h-full p-4 ${node.color} transition-colors`;
    return node.visualType === 'pill' ? (
      <div className={`${baseClasses} rounded-full flex items-center`}>
        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
        <div className="flex-grow">
          <h3 className="font-medium">{node.title}</h3>
          <p className="text-sm text-gray-600">{node.description}</p>
        </div>
      </div>
    ) : (
      <div className={`${baseClasses} rounded-md`}>
        <h3 className="font-medium mb-2">{node.title}</h3>
        <p className="text-sm">{node.description}</p>
      </div>
    );
  };

  return (
    <Rnd
      size={{ width: node.width, height: node.height }}
      position={{ x: node.x, y: node.y }}
      onDragStart={(e) => onDragStart(e, node.id)}
      scale={zoom}
      className="group relative"
    >
      {renderNodeContent()}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="bg-black bg-opacity-10">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <Select onValueChange={handleVisualTypeChange} defaultValue={node.visualType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visual Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pill">Pill Node</SelectItem>
                    <SelectItem value="postit">Post-it Node</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <Select onValueChange={handleDataTypeChange} defaultValue={node.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Data Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generic">Generic</SelectItem>
                    <SelectItem value="person">Person</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                    <SelectItem value="object">Object</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="concept">Concept</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <Select onValueChange={handleColorChange} defaultValue={node.color}>
                  <SelectTrigger>
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="#FFFFA5">Yellow</SelectItem>
                    <SelectItem value="#FFB5E8">Pink</SelectItem>
                    <SelectItem value="#85E3FF">Blue</SelectItem>
                    <SelectItem value="#ACE7AE">Green</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAIClick}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Conversation
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Rnd>
  );
};

export default NodeRenderer;
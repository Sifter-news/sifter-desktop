import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, Type, Palette } from 'lucide-react';

const FocusedNodeTooltip = ({ node, onUpdate, onDelete }) => {
  const handleColorChange = (color) => {
    onUpdate(node.id, { color });
  };

  const handleTextSizeChange = (textSize) => {
    onUpdate(node.id, { textSize });
  };

  const handleNodeTypeChange = (type) => {
    onUpdate(node.id, { type });
  };

  const handleDelete = () => {
    onDelete(node.id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="absolute top-2 right-2">
          Edit
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <Input
              type="color"
              value={node.color || '#FFFFA5'}
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <Select onValueChange={handleTextSizeChange} defaultValue={node.textSize || 'text-base'}>
              <SelectTrigger>
                <SelectValue placeholder="Text size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-sm">Small</SelectItem>
                <SelectItem value="text-base">Medium</SelectItem>
                <SelectItem value="text-lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Select onValueChange={handleNodeTypeChange} defaultValue={node.type}>
              <SelectTrigger>
                <SelectValue placeholder="Node type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Blank Node</SelectItem>
                <SelectItem value="postit">Post-it Node</SelectItem>
                <SelectItem value="text">Text Node</SelectItem>
                <SelectItem value="ai">AI Node</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="h-4 w-4 mr-2" />
            Delete Node
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FocusedNodeTooltip;
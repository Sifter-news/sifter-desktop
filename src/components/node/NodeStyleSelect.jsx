import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Layout, Square, Maximize2, StickyNote } from 'lucide-react';

const NodeStyleSelect = ({ value, onChange }) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="style">Visual Style</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select visual style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-2" />
              Default
            </div>
          </SelectItem>
          <SelectItem value="compact">
            <div className="flex items-center">
              <Layout className="h-4 w-4 mr-2" />
              Compact
            </div>
          </SelectItem>
          <SelectItem value="expanded">
            <div className="flex items-center">
              <Maximize2 className="h-4 w-4 mr-2" />
              Expanded
            </div>
          </SelectItem>
          <SelectItem value="postit">
            <div className="flex items-center">
              <StickyNote className="h-4 w-4 mr-2" />
              Post-it
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NodeStyleSelect;
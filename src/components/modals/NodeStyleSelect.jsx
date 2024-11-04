import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout, Square, StickyNote } from 'lucide-react';

const NodeStyleSelect = ({ value, onChange }) => {
  const getCurrentIcon = () => {
    const icons = {
      default: Square,
      compact: Layout,
      expanded: Layout,
      postit: StickyNote
    };
    const Icon = icons[value] || Square;
    return <Icon className="h-4 w-4 mr-2" />;
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <div className="flex items-center">
          {getCurrentIcon()}
          <SelectValue placeholder="Select style" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
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
              <Layout className="h-4 w-4 mr-2" />
              Expanded
            </div>
          </SelectItem>
          <SelectItem value="postit">
            <div className="flex items-center">
              <StickyNote className="h-4 w-4 mr-2" />
              Post-it
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default NodeStyleSelect;
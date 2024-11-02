import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NodeStyleSelect = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select style" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="compact">Compact</SelectItem>
          <SelectItem value="expanded">Expanded</SelectItem>
          <SelectItem value="postit">Post-it</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default NodeStyleSelect;
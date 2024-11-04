import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NODE_STYLES } from '@/utils/nodeConstants';

const NodeStyleSelect = ({ value, onChange }) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="style">Style</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(NODE_STYLES).map(([key, { label, icon: Icon }]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center">
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NodeStyleSelect;
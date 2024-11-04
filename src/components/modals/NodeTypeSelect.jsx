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
import { NODE_TYPES } from '@/utils/nodeConstants';

const NodeTypeSelect = ({ value, onChange }) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="type">Type</Label>
      <Select value={value || 'generic'} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue>
            {NODE_TYPES[value]?.label || 'Generic Note'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(NODE_TYPES).map(([key, { label, icon: Icon }]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NodeTypeSelect;
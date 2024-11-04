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
  const CurrentIcon = NODE_TYPES[value]?.icon || NODE_TYPES.note.icon;

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="type">Type</Label>
      <Select value={value || 'note'} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue>
            <div className="flex items-center gap-1"> {/* Reduced gap from gap-2 to gap-1 */}
              <CurrentIcon className="h-4 w-4" />
              {NODE_TYPES[value]?.label || 'Note'}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(NODE_TYPES).map(([key, { label, icon: Icon }]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-1"> {/* Reduced gap from gap-2 to gap-1 */}
                  <Icon className="h-4 w-4" />
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
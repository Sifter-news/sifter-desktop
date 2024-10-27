import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NodeTypeSelect = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select node type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="generic">Generic Node</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectItem value="node_person">Person</SelectItem>
          <SelectItem value="node_organization">Organization</SelectItem>
          <SelectItem value="node_object">Object</SelectItem>
          <SelectItem value="node_concept">Concept</SelectItem>
          <SelectItem value="node_location">Location</SelectItem>
          <SelectItem value="node_event">Event</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default NodeTypeSelect;
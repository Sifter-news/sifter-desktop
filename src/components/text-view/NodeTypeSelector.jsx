import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NodeTypeSelector = ({ selectedType, setSelectedType }) => {
  return (
    <Select value={selectedType} onValueChange={setSelectedType}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>General</SelectLabel>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="generic">Generic Node</SelectItem>
          <SelectItem value="group">Groups</SelectItem>
        </SelectGroup>
        
        <SelectGroup>
          <SelectLabel>People & Organizations</SelectLabel>
          <SelectItem value="node_person">Person</SelectItem>
          <SelectItem value="node_organization">Organization</SelectItem>
          <SelectItem value="node_group">Group</SelectItem>
          <SelectItem value="node_network">Network</SelectItem>
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Places & Locations</SelectLabel>
          <SelectItem value="node_location">Location</SelectItem>
          <SelectItem value="node_address">Address</SelectItem>
          <SelectItem value="node_building">Building</SelectItem>
          <SelectItem value="node_area">Area</SelectItem>
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Events & Time</SelectLabel>
          <SelectItem value="node_event">Event</SelectItem>
          <SelectItem value="node_meeting">Meeting</SelectItem>
          <SelectItem value="node_incident">Incident</SelectItem>
          <SelectItem value="node_timeline">Timeline</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default NodeTypeSelector;
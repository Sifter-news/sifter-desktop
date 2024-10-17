import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NodeEditor = ({ node, onUpdate, isEditing, onBlur }) => {
  const handleTypeChange = (newType) => {
    onUpdate(node.id, { ...node, type: newType });
  };

  return (
    <>
      <Select onValueChange={handleTypeChange} defaultValue={node.type}>
        <SelectTrigger>
          <SelectValue placeholder="Node type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basic">Basic</SelectItem>
          <SelectItem value="person">Person</SelectItem>
          <SelectItem value="organization">Organization</SelectItem>
          <SelectItem value="object">Object</SelectItem>
          <SelectItem value="event">Event</SelectItem>
          <SelectItem value="concept">Concept</SelectItem>
          <SelectItem value="location">Location</SelectItem>
        </SelectContent>
      </Select>
      <Input
        value={node.title}
        onChange={(e) => onUpdate(node.id, { ...node, title: e.target.value })}
        placeholder="Title"
        className="mt-2"
        readOnly={!isEditing}
        onBlur={onBlur}
      />
      <Textarea
        value={node.description}
        onChange={(e) => onUpdate(node.id, { ...node, description: e.target.value })}
        placeholder="Description"
        className="mt-2"
        readOnly={!isEditing}
        onBlur={onBlur}
      />
    </>
  );
};

export default NodeEditor;
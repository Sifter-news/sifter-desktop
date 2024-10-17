import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FocusedNodeTooltip from './FocusedNodeTooltip';

const NodeRenderer = ({ node, onDragStart, zoom, onNodeUpdate, onFocus, isFocused, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    onFocus(node.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onNodeUpdate(node.id, node);
  };

  const handleTypeChange = (newType) => {
    onNodeUpdate(node.id, { ...node, type: newType });
  };

  const renderNodeContent = () => {
    return (
      <div className="w-full h-full bg-white rounded-md shadow-md flex flex-col p-4 overflow-auto">
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
          onChange={(e) => onNodeUpdate(node.id, { ...node, title: e.target.value })}
          placeholder="Title"
          className="mt-2"
        />
        <Input
          value={node.abstract}
          onChange={(e) => onNodeUpdate(node.id, { ...node, abstract: e.target.value })}
          placeholder="Abstract"
          className="mt-2"
        />
        <Textarea
          value={node.description}
          onChange={(e) => onNodeUpdate(node.id, { ...node, description: e.target.value })}
          placeholder="Description"
          className="mt-2"
        />
        {renderAdditionalFields()}
      </div>
    );
  };

  const renderAdditionalFields = () => {
    switch (node.type) {
      case 'person':
        return (
          <>
            <Input
              value={node.gender}
              onChange={(e) => onNodeUpdate(node.id, { ...node, gender: e.target.value })}
              placeholder="Gender"
              className="mt-2"
            />
            <Input
              value={node.dateOfBirth}
              onChange={(e) => onNodeUpdate(node.id, { ...node, dateOfBirth: e.target.value })}
              placeholder="Date of Birth"
              className="mt-2"
            />
            {/* Add more fields for PersonNode */}
          </>
        );
      case 'organization':
        return (
          <>
            <Input
              value={node.headquarters}
              onChange={(e) => onNodeUpdate(node.id, { ...node, headquarters: e.target.value })}
              placeholder="Headquarters"
              className="mt-2"
            />
            {/* Add more fields for OrganizationNode */}
          </>
        );
      // Add cases for other node types
      default:
        return null;
    }
  };

  return (
    <Rnd
      size={{ width: node.width || 200, height: node.height || 200 }}
      position={{ x: node.x, y: node.y }}
      onDragStart={(e) => onDragStart(e, node.id)}
      onDragStop={(e, d) => onNodeUpdate(node.id, { x: d.x, y: d.y })}
      onResize={(e, direction, ref, delta, position) => {
        onNodeUpdate(node.id, {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
      className={`cursor-move ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
      onClick={handleClick}
    >
      {renderNodeContent()}
      {isFocused && (
        <FocusedNodeTooltip
          node={node}
          onUpdate={onNodeUpdate}
          onDelete={onDelete}
        />
      )}
    </Rnd>
  );
};

export default NodeRenderer;
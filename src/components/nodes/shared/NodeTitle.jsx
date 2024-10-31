import React from 'react';
import { Input } from "@/components/ui/input";

const NodeTitle = ({ title, isEditing, onChange, onBlur }) => {
  if (isEditing) {
    return (
      <Input
        value={title}
        onChange={onChange}
        onBlur={onBlur}
        className="bg-transparent border-none flex-1"
        placeholder="Title"
        autoFocus
      />
    );
  }

  return <div className="font-medium flex-1">{title}</div>;
};

export default NodeTitle;
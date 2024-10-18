import React from 'react';
import { Button } from "@/components/ui/button";

const NodeCreator = ({ onDragStart }) => {
  const nodeTypes = ['basic', 'postit', 'person', 'event', 'location'];

  return (
    <div className="flex flex-col space-y-2">
      {nodeTypes.map((type) => (
        <Button
          key={type}
          draggable
          onDragStart={(e) => onDragStart(type)}
          className="cursor-move"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default NodeCreator;
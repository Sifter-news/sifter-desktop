import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const NodeComponent = ({ node, transform, onMouseDown, onUpdate, onDelete }) => {
  const style = {
    position: 'absolute',
    left: `${node.x}px`,
    top: `${node.y}px`,
    transform: `scale(${transform?.scale || 1})`,
    cursor: 'move',
    zIndex: 10,
  };

  return (
    <div
      style={style}
      onMouseDown={onMouseDown}
      className="select-none"
    >
      <Card className="w-[200px]">
        <CardHeader className="relative p-3">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-sm">
            <input
              type="text"
              value={node.title}
              onChange={(e) => onUpdate({ ...node, title: e.target.value })}
              className="bg-transparent w-full outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <textarea
            value={node.description || ''}
            onChange={(e) => onUpdate({ ...node, description: e.target.value })}
            className="w-full h-20 bg-transparent resize-none outline-none text-sm"
            placeholder="Add description..."
            onClick={(e) => e.stopPropagation()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NodeComponent;
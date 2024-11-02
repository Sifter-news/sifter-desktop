import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MessageSquare } from 'lucide-react';

const NodeTooltip = ({ node, onView, onEdit, onDelete, onAIChat }) => {
  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-lg p-2 flex gap-1">
      {onView && (
        <Button variant="ghost" size="sm" onClick={() => onView(node)}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={() => onEdit(node)}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={() => onDelete(node.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      {onAIChat && (
        <Button variant="ghost" size="sm" onClick={() => onAIChat(node)}>
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default NodeTooltip;
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  MessageSquarePlus 
} from 'lucide-react';

const NodeListItemActions = ({ 
  node, 
  onEdit, 
  onDelete, 
  onAIConversation 
}) => {
  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(node);
          }}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {onAIConversation && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onAIConversation(node);
          }}
          className="h-8 w-8"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      )}

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default NodeListItemActions;
import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, MessageCircle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NodeEditMenu = ({ onEdit, onDelete, onAIConversation }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        {onAIConversation && (
          <DropdownMenuItem 
            onClick={onAIConversation}
            className="bg-purple-600 hover:bg-purple-700 text-white focus:bg-purple-700 focus:text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Conversation
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-red-600"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeEditMenu;
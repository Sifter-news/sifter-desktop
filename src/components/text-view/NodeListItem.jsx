import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getNodeTypeIcon } from './NodeTypeIcon';
import { GripVertical, Pencil, Trash2, MoreVertical, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Draggable } from 'react-beautiful-dnd';
import { toast } from "sonner";
import { useDebug } from '@/contexts/DebugContext';

const NodeListItem = ({ 
  node, 
  index,
  isSelected, 
  onSelect, 
  onFocus, 
  onUpdateNode, 
  onAIConversation = () => toast.error("AI Conversation not available"),
  isFocused,
  onEdit,
  onDelete 
}) => {
  const { setHoveredElement } = useDebug();
  if (!node) return null;

  const handleMouseEnter = () => {
    setHoveredElement({
      component: 'NodeListItem',
      metadata: {
        id: node.id,
        type: node.nodeType || 'Generic Note',
        title: node.title,
        description: node.description,
        isSelected,
        isFocused
      }
    });
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await onDelete(node.id);
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    }
  };

  return (
    <Draggable draggableId={node.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`group flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded-lg mb-1 transition-all duration-200 ${
            isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
          } ${isFocused ? 'ring-2 ring-blue-600' : ''}`}
          onClick={() => onSelect(node.id)}
        >
          <div className="flex items-center gap-2 flex-grow transition-all">
            <div className="w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 overflow-hidden cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            
            <div 
              className="flex items-center flex-grow cursor-pointer gap-3"
              onClick={(e) => {
                e.stopPropagation();
                onFocus(node.id);
              }}
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src="/default-image.png" alt={node.title} />
                <AvatarFallback>{getNodeTypeIcon(node.nodeType)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{node.title}</div>
                <div className="text-xs text-gray-500">{node.nodeType || 'Generic Note'}</div>
              </div>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) {
                    onEdit(node);
                  } else {
                    toast.error("Edit functionality is not available");
                  }
                }}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAIConversation(node);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white focus:bg-purple-700 focus:text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI Conversation
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default NodeListItem;
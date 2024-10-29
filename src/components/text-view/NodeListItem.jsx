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

  const handleAIConversation = (e) => {
    e.stopPropagation();
    if (typeof onAIConversation === 'function') {
      onAIConversation(node);
    } else {
      toast.error("AI Conversation functionality is not available");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (typeof onEdit === 'function') {
      onEdit(node);
    } else {
      toast.error("Edit functionality is not available");
    }
  };

  return (
    <Draggable draggableId={node.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`group flex items-center justify-between p-1 hover:bg-gray-100 rounded-lg mb-0.5 transition-all duration-200 ${
            isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
          } ${isFocused ? 'ring-2 ring-blue-600' : ''}`}
          onClick={() => onSelect(node.id)}
        >
          <div className="flex items-center gap-2 flex-grow transition-all">
            <div
              {...provided.dragHandleProps}
              className="w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            
            <div 
              className="flex items-center flex-grow cursor-pointer gap-3"
              onClick={(e) => {
                e.stopPropagation();
                onFocus(node.id);
              }}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src="/default-image.png" alt={node.title} />
                <AvatarFallback>{getNodeTypeIcon(node.nodeType)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{node.title}</div>
                <div className="text-xs text-gray-500">{node.nodeType || 'Generic Note'}</div>
                {node.description && (
                  <div className="text-sm text-gray-500 h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-200">
                    {node.description}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleAIConversation}
                  className="bg-purple-600 hover:bg-purple-700 text-white focus:bg-purple-700 focus:text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI Conversation
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof onDelete === 'function') {
                      onDelete(node.id);
                    } else {
                      toast.error("Delete functionality is not available");
                    }
                  }}
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

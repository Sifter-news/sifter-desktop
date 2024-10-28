import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getNodeTypeIcon } from './NodeTypeIcon';
import { GripVertical, Pencil, Trash2, MoreVertical, MessageCircle, Layout, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Draggable } from 'react-beautiful-dnd';

const NodeListItem = ({ 
  node, 
  index,
  isSelected, 
  onSelect, 
  onFocus, 
  onUpdateNode, 
  onAIConversation,
  isFocused,
  onEdit,
  onDelete 
}) => {
  if (!node) return null;

  return (
    <Draggable draggableId={node.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg mb-2 transition-all duration-200 ${
            isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
          } ${isFocused ? 'ring-2 ring-blue-600' : ''}`}
          onClick={() => onSelect(node.id)}
        >
          <div className="flex items-center gap-2 flex-grow">
            <div
              {...provided.dragHandleProps}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
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
                <div className="text-sm text-gray-500">{node.description}</div>
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit(node);
                }}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onAIConversation(node)}
                  className="bg-purple-600 hover:bg-purple-700 text-white focus:bg-purple-700 focus:text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI Conversation
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node.id);
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
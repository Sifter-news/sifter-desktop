import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MoreVertical, Trash, FolderInput, Users, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavigatorItem = ({ 
  item, 
  index, 
  onDocumentClick, 
  dragOverFolder, 
  setDragOverFolder, 
  setDragTimer, 
  isFocused,
  onEditProject 
}) => {
  const handleDragEnter = () => {
    if (item.type === 'folder') {
      setDragOverFolder(item.id);
      setDragTimer(setTimeout(() => {
        // This will be handled in the onDragEnd function in the parent component
      }, 1500)); // 1.5 seconds delay
    }
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
    if (setDragTimer) clearTimeout(setDragTimer);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('node')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      
      toast.success('Node deleted successfully');
      // Refresh the page to update the node list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    }
  };

  const getNodeTypeDisplay = (nodeType) => {
    const types = {
      'node_person': 'Person',
      'node_organization': 'Organization',
      'node_object': 'Object',
      'node_concept': 'Concept',
      'node_location': 'Location',
      'node_event': 'Event',
      'node': 'Generic Note',
      'generic': 'Generic Note'
    };
    return types[nodeType] || 'Generic Note';
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`cursor-pointer hover:bg-gray-200 p-2 rounded flex flex-col transition-all duration-200 ${
            dragOverFolder === item.id ? 'bg-blue-100' : ''
          } ${isFocused ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
          onClick={() => onDocumentClick(item)}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div className="flex justify-between items-center">
            <span>{item.type === 'folder' ? '📁' : '📄'} {item.title}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-300" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEditProject(item);
                }}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Create Group')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Create Group</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Move')}>
                  <FolderInput className="mr-2 h-4 w-4" />
                  <span>Move to</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <span className="text-sm text-gray-500 ml-6">{getNodeTypeDisplay(item.nodeType || 'node')}</span>
        </li>
      )}
    </Draggable>
  );
};

export default NavigatorItem;
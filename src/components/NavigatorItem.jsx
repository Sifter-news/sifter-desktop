import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MoreVertical, Trash, FolderInput, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavigatorItem = ({ item, index, onDocumentClick, dragOverFolder, setDragOverFolder, setDragTimer, isFocused }) => {
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
                <DropdownMenuItem onClick={() => console.log('Create Group')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Create Group</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Delete')}>
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
          <div className="text-sm text-gray-500 ml-6 flex items-center space-x-2">
            <span>{getNodeTypeDisplay(item.nodeType || 'node')}</span>
            {item.step && <span className="text-blue-500">• Step {item.step}</span>}
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default NavigatorItem;
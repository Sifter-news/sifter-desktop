import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FolderItem = ({ folder, index, isOpen, onToggle, children, isDraggedOver }) => {
  return (
    <Draggable draggableId={folder.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-2"
        >
          <div 
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors duration-200
              ${isDraggedOver 
                ? 'bg-blue-100 ring-2 ring-blue-400 ring-inset' 
                : 'hover:bg-gray-100'}`}
            {...provided.dragHandleProps}
            onClick={onToggle}
          >
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <Folder className={`h-4 w-4 ${isDraggedOver ? 'text-blue-600' : ''}`} />
            <span className="text-sm font-medium">{folder.title}</span>
          </div>
          {isOpen && (
            <div className="ml-4 pl-4 border-l border-gray-200">
              {children}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default FolderItem;
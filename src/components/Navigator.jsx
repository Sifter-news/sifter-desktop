import React, { useState } from 'react';
import { MoreVertical, Trash, FolderInput, FolderPlus, FilePlus, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import NavigatorItem from './NavigatorItem';

const Navigator = ({ items, setItems, onDocumentClick }) => {
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [dragTimer, setDragTimer] = useState(null);

  const handleAddFolder = () => {
    const newFolder = {
      id: Date.now().toString(),
      type: 'folder',
      title: `New Folder ${items.filter(item => item.type === 'folder').length + 1}`,
      children: []
    };
    setItems([...items, newFolder]);
  };

  const handleCreateDocument = () => {
    const newDocument = {
      id: Date.now().toString(),
      type: 'document',
      title: `New Document ${items.filter(item => item.type === 'document').length + 1}`,
      content: 'This is a new document.',
      children: []
    };
    setItems([...items, newDocument]);
  };

  const onDragStart = () => {
    if (dragTimer) clearTimeout(dragTimer);
  };

  const onDragEnd = (result) => {
    if (dragTimer) clearTimeout(dragTimer);
    setDragOverFolder(null);

    if (!result.destination) return;

    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const findItemById = (items, id) => {
      for (let item of items) {
        if (item.id === id) return item;
        if (item.children.length > 0) {
          const found = findItemById(item.children, id);
          if (found) return found;
        }
      }
    };

    const sourceItem = findItemById(items, result.draggableId);
    const destinationItem = findItemById(items, result.destination.droppableId);

    if (destinationItem && destinationItem.type === 'folder') {
      const newItems = [...items];
      const sourceParent = findItemById(newItems, result.source.droppableId);
      
      if (sourceParent) {
        sourceParent.children = sourceParent.children.filter(child => child.id !== sourceItem.id);
      } else {
        const index = newItems.findIndex(item => item.id === sourceItem.id);
        if (index !== -1) newItems.splice(index, 1);
      }

      destinationItem.children.splice(result.destination.index, 0, sourceItem);
      setItems(newItems);
    } else {
      setItems(reorder(items, result.source.index, result.destination.index));
    }
  };

  const renderItems = (items, level = 0) => (
    <Droppable droppableId={level === 0 ? 'root' : items[0].id} type="ITEM">
      {(provided) => (
        <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-2 w-full"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {items.map((item, index) => (
            <NavigatorItem
              key={item.id}
              item={item}
              index={index}
              onDocumentClick={onDocumentClick}
              dragOverFolder={dragOverFolder}
              setDragOverFolder={setDragOverFolder}
              setDragTimer={setDragTimer}
            />
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="font-bold">Navigator</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleAddFolder}>
              <FolderPlus className="mr-2 h-4 w-4" />
              <span>Add Folder</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCreateDocument}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>Create Document</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {renderItems(items)}
      </DragDropContext>
    </div>
  );
};

export default Navigator;
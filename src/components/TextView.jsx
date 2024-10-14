import React, { useState } from 'react';
import { MoreVertical, Trash, Share, FolderInput, FolderPlus, FilePlus, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TextView = ({ project }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [items, setItems] = useState([
    { id: '1', type: 'document', title: 'Document 1', content: 'This is the content of Document 1.', children: [] },
    { id: '2', type: 'folder', title: 'Folder 1', children: [
      { id: '3', type: 'document', title: 'Document 2', content: 'This is the content of Document 2.', children: [] },
    ]},
    { id: '4', type: 'document', title: 'Document 3', content: 'This is the content of Document 3.', children: [] },
  ]);

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

  const handleDelete = () => {
    console.log('Delete document');
    // Implement delete functionality here
  };

  const handleShare = () => {
    console.log('Share document');
    // Implement share functionality here
  };

  const handleMove = () => {
    console.log('Move document');
    // Implement move functionality here
  };

  const handleCreateGroup = () => {
    console.log('Create group');
    // Implement create group functionality here
  };

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

  const onDragEnd = (result) => {
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
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-between items-center"
                  onClick={() => item.type === 'document' && handleDocumentClick(item)}
                >
                  <span>{item.type === 'folder' ? '📁' : '📄'} {item.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-300" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleCreateGroup}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Create Group</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleMove}>
                        <FolderInput className="mr-2 h-4 w-4" />
                        <span>Move to</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto flex flex-col items-center">
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
        <DragDropContext onDragEnd={onDragEnd}>
          {renderItems(items)}
        </DragDropContext>
      </div>
      <div className="w-3/4 p-8 flex justify-center items-start">
        {selectedDocument ? (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold mb-4">{selectedDocument.title}</h2>
            <p className="text-gray-600">{selectedDocument.content}</p>
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMove}>
                    <FolderInput className="mr-2 h-4 w-4" />
                    <span>Move</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Select a document from the navigator to view its content.
          </div>
        )}
      </div>
    </div>
  );
};

export default TextView;
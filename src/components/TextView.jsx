import React, { useState } from 'react';
import { MoreVertical, Trash, Share, FolderInput, FolderPlus, FilePlus, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TextView = ({ project }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const documents = [
    { id: 1, title: 'Document 1', content: 'This is the content of Document 1.' },
    { id: 2, title: 'Document 2', content: 'This is the content of Document 2.' },
    { id: 3, title: 'Document 3', content: 'This is the content of Document 3.' },
    { id: 4, title: 'Document 4', content: 'This is the content of Document 4.' },
    { id: 5, title: 'Document 5', content: 'This is the content of Document 5.' },
    { id: 6, title: 'Document 6', content: 'This is the content of Document 6.' },
    { id: 7, title: 'Document 7', content: 'This is the content of Document 7.' },
  ];

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
    console.log('Add folder');
    // Implement add folder functionality here
  };

  const handleCreateDocument = () => {
    console.log('Create document');
    // Implement create document functionality here
  };

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
        <ul className="space-y-2 w-full">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-between items-center"
              onClick={() => handleDocumentClick(doc)}
            >
              <span>📄 {doc.title}</span>
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
          ))}
        </ul>
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
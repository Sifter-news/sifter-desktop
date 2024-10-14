import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Navigator from './Navigator';

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

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <Navigator items={items} setItems={setItems} onDocumentClick={handleDocumentClick} />
      </div>
      <div className="w-3/4 p-8 flex justify-center items-start">
        {selectedDocument ? (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold mb-4">{selectedDocument.title}</h2>
            <p className="text-gray-600">{selectedDocument.content}</p>
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="sm" onClick={handleDelete}>Delete</Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>Share</Button>
              <Button variant="ghost" size="sm" onClick={handleMove}>Move</Button>
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
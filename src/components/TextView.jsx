import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Navigator from './Navigator';

const TextView = ({ project, focusedDocument, setFocusedDocument }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [items, setItems] = useState([
    { id: '1', type: 'document', title: 'Document 1', content: 'This is the content of Document 1.', children: [] },
    { id: '2', type: 'folder', title: 'Folder 1', children: [
      { id: '3', type: 'document', title: 'Document 2', content: 'This is the content of Document 2.', children: [] },
    ]},
    { id: '4', type: 'document', title: 'Document 3', content: 'This is the content of Document 3.', children: [] },
  ]);

  useEffect(() => {
    if (focusedDocument) {
      setSelectedDocument(focusedDocument);
    } else if (items.length > 0) {
      const firstDocument = items.find(item => item.type === 'document') || items[0];
      setSelectedDocument(firstDocument);
      setFocusedDocument(firstDocument);
    }
  }, [focusedDocument, items, setFocusedDocument]);

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setFocusedDocument(doc);
  };

  const handleContentChange = (e) => {
    const updatedDocument = { ...selectedDocument, content: e.target.value };
    setSelectedDocument(updatedDocument);
    setItems(prevItems => prevItems.map(item => 
      item.id === updatedDocument.id ? updatedDocument : item
    ));
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
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <Navigator 
          items={items} 
          setItems={setItems} 
          onDocumentClick={handleDocumentClick}
          focusedDocument={selectedDocument}
        />
      </div>
      <div className="flex-grow flex flex-col p-8 overflow-hidden">
        {selectedDocument ? (
          <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 relative flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4">{selectedDocument.title}</h2>
            <textarea
              value={selectedDocument.content}
              onChange={handleContentChange}
              className="flex-grow w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
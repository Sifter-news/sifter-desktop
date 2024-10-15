import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Navigator from './Navigator';

const TextView = ({ project, nodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    if (nodes.length > 0 && !selectedDocument) {
      setSelectedDocument(nodes[0]);
    }
  }, [nodes, selectedDocument]);

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

  const handleContentChange = (e) => {
    const updatedDocument = { ...selectedDocument, content: e.target.value };
    setSelectedDocument(updatedDocument);
    onUpdateNode(updatedDocument);
  };

  const handleDelete = () => {
    if (selectedDocument) {
      onDeleteNode(selectedDocument.id);
      setSelectedDocument(null);
    }
  };

  const handleShare = () => {
    console.log('Share document');
    // Implement share functionality here
  };

  const handleMove = () => {
    console.log('Move document');
    // Implement move functionality here
  };

  const handleAddDocument = () => {
    const newDocument = {
      id: Date.now(),
      type: 'document',
      title: `New Document ${nodes.filter(node => node.type === 'document').length + 1}`,
      content: '',
    };
    onAddNode(newDocument);
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <Navigator 
          items={nodes} 
          setItems={onUpdateNode} 
          onDocumentClick={handleDocumentClick}
          focusedDocument={selectedDocument}
        />
        <Button onClick={handleAddDocument} className="mt-4 w-full">Add Document</Button>
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
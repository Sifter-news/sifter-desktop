import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from 'lucide-react';

const NavigatorDocs = ({ documents, onDocumentSelect, selectedDocId }) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        {documents?.length ? (
          documents.map(doc => (
            <div
              key={doc.id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selectedDocId === doc.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onDocumentSelect(doc.id)}
            >
              <h3 className="font-medium">{doc.title}</h3>
              {doc.description && (
                <p className="text-sm text-gray-500">{doc.description}</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <p>No documents uploaded yet</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default NavigatorDocs;
/**
 * @file NavigatorDocs.jsx
 * @description Tab and panel for navigating document-based data within an investigation
 */

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const NavigatorDocs = ({ documents, onDocumentSelect, selectedDocId }) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {documents?.map(doc => (
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
        ))}
      </div>
    </ScrollArea>
  );
};

export default NavigatorDocs;
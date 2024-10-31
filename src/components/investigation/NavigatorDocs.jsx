import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from 'lucide-react';

const NavigatorDocs = () => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="p-4 text-center text-gray-500">
        <FileText className="h-8 w-8 mx-auto mb-2" />
        <p>No documents uploaded yet</p>
      </div>
    </ScrollArea>
  );
};

export default NavigatorDocs;
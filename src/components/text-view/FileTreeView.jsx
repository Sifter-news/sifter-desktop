import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, File } from 'lucide-react';

const FileTreeView = ({ files }) => {
  if (!files) return null;

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="space-y-2 p-2">
        {files.map((file) => (
          <div 
            key={file.path} 
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            {file.type === 'folder' ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <File className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-sm truncate">{file.name}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FileTreeView;
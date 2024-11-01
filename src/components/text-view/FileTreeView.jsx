import React, { useState, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, File, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FileTreeView = ({ files = [], onNodeSelect }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFolderUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).map(file => ({
        name: file.name,
        path: file.webkitRelativePath || file.name,
        type: file.type === '' ? 'folder' : 'file',
        size: file.size
      }));
      
      setUploadedFiles(fileArray);
      toast.success(`Uploaded ${fileArray.length} files`);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const allFiles = [...files, ...uploadedFiles];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Files</h3>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFolderUpload}
            className="hidden"
            webkitdirectory=""
            directory=""
            multiple
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleUploadClick}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Folder
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-2">
          {allFiles.map((file, index) => (
            <div 
              key={`${file.path}-${index}`}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              onClick={() => onNodeSelect && onNodeSelect(file)}
            >
              {file.type === 'folder' ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <File className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm truncate">{file.name}</span>
            </div>
          ))}
          {allFiles.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              No files uploaded yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileTreeView;
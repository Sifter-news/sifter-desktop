import { useState } from 'react';
import { toast } from 'sonner';

export const useFolderManagement = () => {
  const [openFolders, setOpenFolders] = useState({});
  const [draggedOverFolderId, setDraggedOverFolderId] = useState(null);

  const handleToggleFolder = (folderId) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateFolder = (folderName) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      title: folderName,
      type: 'folder',
      children: []
    };
    toast.success('Folder created successfully');
    return newFolder;
  };

  const handleDragUpdate = (update) => {
    if (!update.destination) {
      setDraggedOverFolderId(null);
      return;
    }

    const destId = update.destination.droppableId;
    setDraggedOverFolderId(destId);
  };

  return {
    openFolders,
    draggedOverFolderId,
    handleToggleFolder,
    handleCreateFolder,
    handleDragUpdate,
    setDraggedOverFolderId
  };
};
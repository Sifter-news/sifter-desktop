import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MoreVertical, Trash, FolderInput, Users, Pencil, Copy, FolderPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';
import NavigatorItemActions from './NavigatorItemActions';
import NavigatorItemContent from './NavigatorItemContent';
import { getNodeTypeLabel } from '@/utils/nodeConstants';

const NavigatorItem = ({ 
  item, 
  index, 
  onDocumentClick, 
  dragOverFolder, 
  setDragOverFolder, 
  setDragTimer, 
  isFocused,
  onEditProject 
}) => {
  const handleDragEnter = () => {
    if (item.type === 'folder') {
      setDragOverFolder(item.id);
      setDragTimer(setTimeout(() => {
        // This will be handled in the onDragEnd function in the parent component
      }, 1500)); // 1.5 seconds delay
    }
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
    if (setDragTimer) clearTimeout(setDragTimer);
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`cursor-pointer hover:bg-gray-200 p-2 rounded flex flex-col transition-all duration-200 ${
            dragOverFolder === item.id ? 'bg-blue-100' : ''
          } ${isFocused ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
          onClick={() => onDocumentClick(item)}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <NavigatorItemContent item={item} />
          <NavigatorItemActions 
            item={item}
            onEditProject={onEditProject}
          />
        </li>
      )}
    </Draggable>
  );
};

export default NavigatorItem;

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NavigatorItemActions from './NavigatorItemActions';
import NavigatorItemContent from './NavigatorItemContent';

const NavigatorItem = ({ 
  item, 
  index, 
  onEditProject,
  isDragging,
  setDragTimer,
  handleDragEnter,
  handleDragLeave
}) => {
  const handleDragStart = () => {
    if (setDragTimer) {
      const timer = setTimeout(() => {
        setDragTimer(null);
      }, 3000);
      setDragTimer(timer);
    }
  };

  const handleDragEnd = () => {
    if (setDragTimer) clearTimeout(setDragTimer);
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            p-2 mb-1 rounded cursor-pointer
            ${isDragging ? 'bg-blue-100' : 'hover:bg-gray-100'}
          `}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
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
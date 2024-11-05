import React from 'react';
import { Rnd } from 'react-rnd';
import { GripVertical } from 'lucide-react';
import { NODE_STYLES } from '@/utils/nodeStyles';

const TwoDNode = ({
  node,
  zoom,
  onNodeUpdate,
  onFocus,
  isFocused,
  onDelete,
  isDraggable,
  position,
  onStartConnection,
  onEndConnection,
  dimensions
}) => {
  const handleDragStop = (e, d) => {
    onNodeUpdate(node.id, { x: d.x, y: d.y });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onFocus(node.id);
  };

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={position}
      onDragStop={handleDragStop}
      scale={zoom}
      className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' : ''
      } ${node.color || 'bg-white'}`}
      onClick={handleClick}
      enableResizing={false}
      disableDragging={!isDraggable}
      bounds="parent"
    >
      <div className="p-2 h-full flex items-center gap-2">
        <div className="flex-shrink-0">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-grow min-w-0">
          <div className="truncate font-medium">{node.title}</div>
          {node.description && (
            <div className="text-sm text-gray-500 truncate">{node.description}</div>
          )}
        </div>
      </div>
    </Rnd>
  );
};

export default TwoDNode;
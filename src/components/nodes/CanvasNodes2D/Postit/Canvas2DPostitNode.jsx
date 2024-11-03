import React from 'react';
import { Rnd } from 'react-rnd';
import NodeBase from '../../NodeBase';
import NodeAvatar from '../../shared/NodeAvatar';
import NodeTitle from '../../shared/NodeTitle';
import NodeEditMenu from '../../shared/NodeEditMenu';
import { getNodeStyle } from '../../../utils/renderHelpers';

const Canvas2DPostitNode = ({ 
  node, 
  isHovered, 
  isSelected, 
  onSelect,
  onEdit,
  onDelete,
  onAIConversation,
  isEditing,
  onTitleChange,
  onTitleBlur,
  zoom,
  position,
  onUpdateNode
}) => {
  const baseProps = NodeBase(node);
  const style = getNodeStyle(baseProps.visualStyle, isHovered, isSelected);
  const nodeColor = node.color || 'bg-yellow-100';

  const handleResize = (e, direction, ref, delta, position) => {
    onUpdateNode(node.id, {
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
      x: position.x,
      y: position.y
    });
  };

  return (
    <Rnd 
      size={{ width: node.width || 256, height: node.height || 256 }}
      position={{ x: node.x, y: node.y }}
      onResize={handleResize}
      scale={zoom}
      minWidth={150}
      minHeight={150}
      className={`${style} ${nodeColor} rounded-lg shadow-md`}
      onClick={onSelect}
      resizeHandleClasses={{
        top: 'border-t-2 border-blue-500 cursor-ns-resize opacity-0 group-hover:opacity-100',
        right: 'border-r-2 border-blue-500 cursor-ew-resize opacity-0 group-hover:opacity-100',
        bottom: 'border-b-2 border-blue-500 cursor-ns-resize opacity-0 group-hover:opacity-100',
        left: 'border-l-2 border-blue-500 cursor-ew-resize opacity-0 group-hover:opacity-100',
        topRight: 'w-3 h-3 border-2 border-blue-500 bg-white rounded-sm cursor-ne-resize opacity-0 group-hover:opacity-100',
        bottomRight: 'w-3 h-3 border-2 border-blue-500 bg-white rounded-sm cursor-se-resize opacity-0 group-hover:opacity-100',
        bottomLeft: 'w-3 h-3 border-2 border-blue-500 bg-white rounded-sm cursor-sw-resize opacity-0 group-hover:opacity-100',
        topLeft: 'w-3 h-3 border-2 border-blue-500 bg-white rounded-sm cursor-nw-resize opacity-0 group-hover:opacity-100'
      }}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true
      }}
    >
      <div className="p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <NodeAvatar 
              src={baseProps.avatar} 
              alt={baseProps.title}
            />
            <NodeTitle 
              title={baseProps.title}
              isEditing={isEditing}
              onChange={onTitleChange}
              onBlur={onTitleBlur}
            />
          </div>
          {isHovered && (
            <NodeEditMenu
              onEdit={onEdit}
              onDelete={onDelete}
              onAIConversation={onAIConversation}
            />
          )}
        </div>
        <p className="text-sm text-gray-600 flex-grow overflow-auto">
          {baseProps.description}
        </p>
      </div>
    </Rnd>
  );
};

export default Canvas2DPostitNode;
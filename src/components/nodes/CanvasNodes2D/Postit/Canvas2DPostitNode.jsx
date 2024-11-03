import React from 'react';
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
  position
}) => {
  const baseProps = NodeBase(node);
  const style = getNodeStyle(baseProps.visualStyle, isHovered, isSelected);

  return (
    <div 
      className={`w-64 h-64 p-4 bg-yellow-100 rounded-lg flex flex-col ${style}`}
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: 'translate(0, 0)',
        transformOrigin: '0 0',
        willChange: 'transform, left, top'
      }}
    >
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
      <p className="text-sm text-gray-600 flex-grow">
        {baseProps.description}
      </p>
    </div>
  );
};

export default Canvas2DPostitNode;
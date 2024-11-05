import React from 'react';
import NodeBase from '../../NodeBase';
import NodeAvatar from '../../shared/NodeAvatar';
import NodeTitle from '../../shared/NodeTitle';
import NodeEditMenu from '../../shared/NodeEditMenu';
import { getNodeTypeIcon } from '../../../utils/styleHelpers';

const NavigatorNodeListItem = ({ 
  node, 
  isSelected, 
  onSelect, 
  onEdit,
  onDelete,
  onAIConversation,
  dragHandleProps 
}) => {
  const baseProps = NodeBase(node);

  return (
    <div
      className={`group flex items-center justify-between py-2 px-3 rounded-lg mb-1 transition-all duration-200 cursor-pointer
        ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md' : 'hover:bg-gray-100'}`}
      onClick={onSelect}
      {...dragHandleProps}
    >
      <div className="flex items-center gap-2 flex-grow">
        <NodeAvatar 
          src={baseProps.avatar} 
          alt={baseProps.title}
          size="small"
        />
        <div>
          <NodeTitle title={baseProps.title} />
          <div className="text-xs text-gray-500">
            {getNodeTypeIcon(baseProps.nodeType)} {baseProps.nodeType || 'Generic Note'}
          </div>
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <NodeEditMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onAIConversation={onAIConversation}
        />
      </div>
    </div>
  );
};

export default NavigatorNodeListItem;
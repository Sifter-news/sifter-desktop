import React from 'react';
import NodeBase from '../../NodeBase';
import NodeAvatar from '../../shared/NodeAvatar';
import NodeTitle from '../../shared/NodeTitle';
import NodeEditMenu from '../../shared/NodeEditMenu';
import { getNodeStyle } from '../../../utils/renderHelpers';

const Canvas2DDefaultNode = ({ 
  node, 
  isHovered, 
  isSelected, 
  onSelect,
  onEdit,
  onDelete,
  onAIConversation
}) => {
  const baseProps = NodeBase(node);
  const style = getNodeStyle(baseProps.visualStyle, isHovered, isSelected);

  return (
    <div 
      className={`w-32 h-12 p-2 bg-white rounded-lg flex items-center gap-2 ${style}`}
      onClick={onSelect}
    >
      <NodeAvatar 
        src={baseProps.avatar} 
        alt={baseProps.title}
      />
      <NodeTitle title={baseProps.title} />
      {isHovered && (
        <NodeEditMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onAIConversation={onAIConversation}
        />
      )}
    </div>
  );
};

export default Canvas2DDefaultNode;
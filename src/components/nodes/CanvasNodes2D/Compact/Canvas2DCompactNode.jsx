import React from 'react';
import NodeBase from '../../NodeBase';
import NodeAvatar from '../../shared/NodeAvatar';
import { getNodeStyle } from '../../../utils/renderHelpers';

const Canvas2DCompactNode = ({ node, isHovered, isSelected, onSelect }) => {
  const baseProps = NodeBase(node);
  const style = getNodeStyle(baseProps.visualStyle, isHovered, isSelected);

  return (
    <div 
      className={`w-12 h-12 rounded-full flex items-center justify-center ${style}`}
      onClick={onSelect}
    >
      <NodeAvatar 
        src={baseProps.avatar} 
        alt={baseProps.title} 
        size="small"
      />
    </div>
  );
};

export default Canvas2DCompactNode;
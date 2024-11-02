import React from 'react';

const NodeBase = ({ 
  id,
  title,
  description,
  nodeType,
  visualStyle,
  position,
  metadata,
  avatar = '/default-image.png'
}) => {
  return {
    id,
    title,
    description,
    nodeType,
    visualStyle,
    position,
    metadata,
    avatar
  };
};

export default NodeBase;
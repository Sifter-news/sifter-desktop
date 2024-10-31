import React from 'react';

// Base class for all node types with shared properties and methods
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
  // Common properties all nodes share
  const baseProps = {
    id,
    title,
    description,
    nodeType,
    visualStyle,
    position,
    metadata,
    avatar
  };

  return baseProps;
};

export default NodeBase;
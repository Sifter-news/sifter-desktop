import React from 'react';
import { getNodeTypeIcon } from '@/utils/nodeConstants';

const NodeTypeIcon = ({ nodeType }) => {
  const Icon = getNodeTypeIcon(nodeType);
  return <Icon className="h-4 w-4" />;
};

export { getNodeTypeIcon };
export default NodeTypeIcon;
import React from 'react';
import { getNodeTypeIcon, getNodeTypeLabel } from '@/utils/nodeConstants';

const NavigatorItemContent = ({ item }) => {
  const Icon = getNodeTypeIcon(item.nodeType);
  
  return (
    <div className="flex justify-between items-center">
      <span>{item.type === 'folder' ? '📁' : <Icon className="h-4 w-4 inline mr-2" />} {item.title}</span>
      <span className="text-sm text-gray-500 ml-6">{getNodeTypeLabel(item.nodeType || 'node')}</span>
    </div>
  );
};

export default NavigatorItemContent;
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { getNodeTypeLabel } from '@/utils/nodeConstants';

const NodeSubline = ({ type, metadata }) => {
  const getTypeLabel = () => {
    switch (type) {
      case 'node_person':
        return metadata?.occupation || getNodeTypeLabel(type);
      case 'node_organization':
        return metadata?.industry || getNodeTypeLabel(type);
      case 'node_location':
        return metadata?.address || getNodeTypeLabel(type);
      case 'node_event':
        return metadata?.date || getNodeTypeLabel(type);
      case 'node_object':
        return metadata?.category || getNodeTypeLabel(type);
      default:
        return getNodeTypeLabel(type);
    }
  };

  return (
    <Badge variant="secondary" className="text-xs">
      {getTypeLabel()}
    </Badge>
  );
};

export default NodeSubline;
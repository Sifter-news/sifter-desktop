import React from 'react';
import { Badge } from "@/components/ui/badge";

const NodeSubline = ({ type, metadata }) => {
  const getTypeLabel = () => {
    switch (type) {
      case 'node_person':
        return metadata?.occupation || 'Person';
      case 'node_organization':
        return metadata?.industry || 'Organization';
      case 'node_location':
        return metadata?.address || 'Location';
      case 'node_event':
        return metadata?.date || 'Event';
      case 'node_object':
        return metadata?.category || 'Object';
      default:
        return 'Note';
    }
  };

  return (
    <Badge variant="secondary" className="text-xs">
      {getTypeLabel()}
    </Badge>
  );
};

export default NodeSubline;
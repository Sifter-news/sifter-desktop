import React from 'react';
import { GripVertical } from 'lucide-react';

const NodeDragHandle = ({ className = '' }) => {
  return (
    <div className={`cursor-grab active:cursor-grabbing ${className}`}>
      <GripVertical className="h-4 w-4 text-gray-400" />
    </div>
  );
};

export default NodeDragHandle;
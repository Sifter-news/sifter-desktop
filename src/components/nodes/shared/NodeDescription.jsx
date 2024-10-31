import React from 'react';
import { FileText } from 'lucide-react';

const NodeDescription = ({ description, isEditing, onChange, maxLength = 200 }) => {
  if (isEditing) {
    return (
      <textarea
        value={description}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-24 p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Add a description..."
        maxLength={maxLength}
      />
    );
  }

  if (!description) {
    return (
      <div className="flex items-center justify-center h-24 text-gray-400">
        <FileText className="h-4 w-4 mr-2" />
        <span className="text-sm">No description</span>
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-600 line-clamp-3">
      {description}
    </div>
  );
};

export default NodeDescription;
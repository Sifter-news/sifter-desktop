import React from 'react';
import { FileText, User, Building2, Package, Brain, MapPin, Calendar } from 'lucide-react';

const getNodeTypeIcon = (nodeType) => {
  switch (nodeType) {
    case 'node_person':
      return User;
    case 'node_organization':
      return Building2;
    case 'node_object':
      return Package;
    case 'node_concept':
      return Brain;
    case 'node_location':
      return MapPin;
    case 'node_event':
      return Calendar;
    default:
      return FileText;
  }
};

const NavigatorNodeListItem = ({ node, isSelected, onClick }) => {
  const Icon = getNodeTypeIcon(node.nodeType);

  return (
    <div
      className={`p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
        isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-500" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{node.title}</h3>
          {node.description && (
            <p className="text-sm text-gray-500 truncate">{node.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigatorNodeListItem;
import React from 'react';
import { User, Building2, Package, Brain, MapPin, Calendar, FileText } from 'lucide-react';

const nodeGroups = [
  {
    title: "Basic",
    nodes: [
      { type: 'generic', label: 'Generic Note', icon: FileText }
    ]
  },
  {
    title: "People & Organizations",
    nodes: [
      { type: 'node_person', label: 'Person', icon: User },
      { type: 'node_organization', label: 'Organization', icon: Building2 }
    ]
  },
  {
    title: "Objects & Concepts",
    nodes: [
      { type: 'node_object', label: 'Object', icon: Package },
      { type: 'node_concept', label: 'Concept', icon: Brain }
    ]
  },
  {
    title: "Places & Events",
    nodes: [
      { type: 'node_location', label: 'Location', icon: MapPin },
      { type: 'node_event', label: 'Event', icon: Calendar }
    ]
  }
];

const DraggableNodeTypes = () => {
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
  };

  return (
    <div className="space-y-6 p-4">
      {nodeGroups.map((group) => (
        <div key={group.title} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">{group.title}</h3>
          <div className="space-y-1">
            {group.nodes.map(({ type, label, icon: Icon }) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm cursor-move hover:bg-gray-50 transition-colors"
              >
                <Icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DraggableNodeTypes;
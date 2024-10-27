import React from 'react';

const getNodeTypeDisplay = (nodeType) => {
  const types = {
    'node_person': 'Person',
    'node_organization': 'Organization',
    'node_object': 'Object',
    'node_concept': 'Concept',
    'node_location': 'Location',
    'node_event': 'Event',
    'node': 'Generic Note',
    'generic': 'Generic Note'
  };
  return types[nodeType] || 'Generic Note';
};

const NodeTypeDisplay = ({ nodeType }) => {
  return (
    <span className="text-sm text-gray-500 ml-6">
      {getNodeTypeDisplay(nodeType || 'node')}
    </span>
  );
};

export default NodeTypeDisplay;
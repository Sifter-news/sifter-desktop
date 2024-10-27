import React from 'react';

const nodeTypeIcons = {
  node_person: '👤',
  node_organization: '🏢',
  node_object: '📦',
  node_concept: '💡',
  node_location: '📍',
  node_event: '📅',
  group: '📁',
  generic: '📝'
};

export const getNodeTypeIcon = (nodeType) => {
  return nodeTypeIcons[nodeType] || '📝';
};

export default nodeTypeIcons;
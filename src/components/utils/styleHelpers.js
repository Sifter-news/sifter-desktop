export const NODE_STYLES = {
  compact: {
    width: 48,
    height: 48,
    title: "Compact Note",
    description: "A minimal note style showing only the avatar"
  },
  default: {
    width: 128,
    height: 48,
    title: "Default Note",
    description: "A standard note style with avatar and title"
  },
  postit: {
    width: 256,
    height: 256,
    title: "Post-it Note",
    description: "A larger note style with full content display"
  }
};

export const getNodeTypeIcon = (nodeType) => {
  const icons = {
    node_person: '👤',
    node_organization: '🏢',
    node_object: '📦',
    node_concept: '💡',
    node_location: '📍',
    node_event: '📅',
    generic: '📝'
  };
  
  return icons[nodeType] || '📝';
};
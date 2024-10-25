const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    // Don't serialize DOM nodes or React fiber nodes
    if (value instanceof Node || key.startsWith('__react')) {
      return undefined;
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
};

export const saveProjectState = (projectId, nodes) => {
  const safeNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    x: node.x,
    y: node.y,
    text: node.text,
    title: node.title,
    width: node.width,
    height: node.height,
    color: node.color,
  }));
  localStorage.setItem(`project_${projectId}`, JSON.stringify(safeNodes, getCircularReplacer()));
};

export const loadProjectState = (projectId) => {
  const savedState = localStorage.getItem(`project_${projectId}`);
  return savedState ? JSON.parse(savedState) : [];
};
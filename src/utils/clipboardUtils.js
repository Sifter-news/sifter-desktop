export const copyNode = (node) => {
  const nodeData = {
    ...node,
    id: undefined, // Remove ID so a new one will be generated on paste
    x: undefined,
    y: undefined,
  };
  
  localStorage.setItem('clipboard-node', JSON.stringify(nodeData));
};

export const pasteNode = () => {
  const clipboardData = localStorage.getItem('clipboard-node');
  if (!clipboardData) return null;
  
  const node = JSON.parse(clipboardData);
  return {
    ...node,
    id: Date.now().toString(),
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
};
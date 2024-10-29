export const getBufferSpace = (node) => {
  // Calculate 15% of node dimensions
  const widthBuffer = (node.width || 200) * 0.15;
  const heightBuffer = (node.height || 100) * 0.15;
  return Math.max(widthBuffer, heightBuffer);
};

export const isColliding = (node1, node2) => {
  const buffer = Math.max(getBufferSpace(node1), getBufferSpace(node2));
  
  const rect1 = {
    left: node1.x,
    right: node1.x + (node1.width || 200),
    top: node1.y,
    bottom: node1.y + (node1.height || 100)
  };

  const rect2 = {
    left: node2.x,
    right: node2.x + (node2.width || 200),
    top: node2.y,
    bottom: node2.y + (node2.height || 100)
  };

  return !(
    rect1.right + buffer < rect2.left ||
    rect1.left > rect2.right + buffer ||
    rect1.bottom + buffer < rect2.top ||
    rect1.top > rect2.bottom + buffer
  );
};

export const findNonCollidingPosition = (newNode, existingNodes) => {
  let position = { x: newNode.x, y: newNode.y };
  const buffer = getBufferSpace(newNode);
  let spiralStep = 0;
  
  while (existingNodes.some(node => 
    isColliding({ ...newNode, x: position.x, y: position.y }, node)
  )) {
    // Move in a spiral pattern to find a free spot
    spiralStep++;
    const angle = spiralStep * 0.5;
    const radius = buffer * spiralStep / (2 * Math.PI);
    position.x = newNode.x + radius * Math.cos(angle);
    position.y = newNode.y + radius * Math.sin(angle);
  }
  
  return position;
};
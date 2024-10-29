export const BUFFER_SPACE = 20; // pixels of minimum space between nodes

export const isColliding = (node1, node2) => {
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

  // Add buffer space to the collision check
  return !(
    rect1.right + BUFFER_SPACE < rect2.left ||
    rect1.left > rect2.right + BUFFER_SPACE ||
    rect1.bottom + BUFFER_SPACE < rect2.top ||
    rect1.top > rect2.bottom + BUFFER_SPACE
  );
};

export const findNonCollidingPosition = (newNode, existingNodes) => {
  let position = { x: newNode.x, y: newNode.y };
  const stepSize = BUFFER_SPACE;
  let spiralStep = 0;
  
  while (existingNodes.some(node => 
    isColliding({ ...newNode, x: position.x, y: position.y }, node)
  )) {
    // Move in a spiral pattern to find a free spot
    spiralStep++;
    const angle = spiralStep * 0.5;
    const radius = stepSize * spiralStep / (2 * Math.PI);
    position.x = newNode.x + radius * Math.cos(angle);
    position.y = newNode.y + radius * Math.sin(angle);
  }
  
  return position;
};
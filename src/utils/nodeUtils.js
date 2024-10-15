export const findAvailablePosition = (nodes, newNode) => {
  const nodeWidth = 200; // Assuming a default node width
  const nodeHeight = 200; // Assuming a default node height
  const padding = 20; // Space between nodes

  let x = 0;
  let y = 0;
  let maxY = 0;

  nodes.forEach(node => {
    if (node.y + nodeHeight > maxY) {
      maxY = node.y + nodeHeight;
    }
  });

  while (true) {
    const overlapping = nodes.some(node => 
      x < node.x + nodeWidth + padding &&
      x + nodeWidth + padding > node.x &&
      y < node.y + nodeHeight + padding &&
      y + nodeHeight + padding > node.y
    );

    if (!overlapping) {
      return { x, y };
    }

    x += nodeWidth + padding;

    if (x > window.innerWidth - nodeWidth) {
      x = 0;
      y = maxY + padding;
      maxY = y + nodeHeight;
    }
  }
};
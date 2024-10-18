import { v4 as uuidv4 } from 'uuid';

export const addExampleNodes = () => {
  const nodeTypes = ['basic', 'person', 'organization', 'object', 'event', 'concept', 'location', 'postit'];
  const exampleNodes = nodeTypes.map((type, index) => ({
    id: uuidv4(),
    type,
    title: `Example ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
    abstract: `This is an example of a ${type} node.`,
    description: `Use this ${type} node as a template for creating your own nodes.`,
    x: 100 + (index % 4) * 250,
    y: 100 + Math.floor(index / 4) * 200,
  }));

  return exampleNodes;
};
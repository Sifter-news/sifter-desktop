import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';
import * as THREE from 'three';

// Node styles and dimensions
export const NODE_STYLES = {
  compact: {
    width: 48,
    height: 48,
    resizable: false,
    title: "Compact Note",
    description: "A minimal note style showing only the avatar",
    display: {
      avatar: true,
      title: false,
      description: false
    }
  },
  default: {
    width: 128,
    height: 48,
    resizable: false,
    title: "Default Note",
    description: "A standard note style with avatar and title",
    display: {
      avatar: true,
      title: true,
      description: false
    }
  },
  postit: {
    width: 256,
    height: 256,
    resizable: true,
    title: "Post-it Note",
    description: "A larger note style with full content display",
    display: {
      avatar: true,
      title: true,
      description: true
    }
  }
};

export const getNodeDimensions = (visualStyle) => {
  const style = NODE_STYLES[visualStyle] || NODE_STYLES.default;
  return {
    width: style.width,
    height: style.height
  };
};

export const getNodeStyle = (visualStyle) => {
  return NODE_STYLES[visualStyle] || NODE_STYLES.default;
};

// Node operations
export const createNode = async (nodeData, projectId) => {
  try {
    const { data, error } = await supabase
      .from('node')
      .insert([{
        ...nodeData,
        investigation_id: projectId,
      }])
      .select()
      .single();

    if (error) throw error;
    toast.success('Node created successfully');
    return data;
  } catch (error) {
    toast.error('Failed to create node');
    throw error;
  }
};

export const updateNode = async (nodeId, updates) => {
  try {
    const { error } = await supabase
      .from('node')
      .update(updates)
      .eq('id', nodeId);

    if (error) throw error;
    toast.success('Node updated successfully');
  } catch (error) {
    toast.error('Failed to update node');
    throw error;
  }
};

export const deleteNode = async (nodeId) => {
  try {
    const { error } = await supabase
      .from('node')
      .delete()
      .eq('id', nodeId);

    if (error) throw error;
    toast.success('Node deleted successfully');
  } catch (error) {
    toast.error('Failed to delete node');
    throw error;
  }
};

// Position and collision utilities
export const findAvailablePosition = (nodes, newNode) => {
  const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(newNode?.visualStyle);
  const padding = 20;
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

// 3D utilities
export const calculate3DDistance = (pos1, pos2) => {
  return Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) +
    Math.pow(pos1[1] - pos2[1], 2) +
    Math.pow(pos1[2] - pos2[2], 2)
  );
};

export const getNodeDimensions3D = (visualStyle) => {
  const style = NODE_STYLES[visualStyle || 'default'];
  return {
    width: style.width / 20,
    height: style.height / 20,
    depth: visualStyle === 'postit' ? 0.5 : 0.2
  };
};

export const isColliding3D = (node1, node2) => {
  const dim1 = getNodeDimensions3D(node1.visualStyle);
  const dim2 = getNodeDimensions3D(node2.visualStyle);
  
  const buffer = Math.max(8 / 20, dim1.width * 0.15, dim2.width * 0.15);
  
  return Math.abs(node1.position[0] - node2.position[0]) < (dim1.width + dim2.width) / 2 + buffer &&
         Math.abs(node1.position[1] - node2.position[1]) < (dim1.height + dim2.height) / 2 + buffer &&
         Math.abs(node1.position[2] - node2.position[2]) < (dim1.depth + dim2.depth) / 2 + buffer;
};

export const findNonCollidingPosition3D = (newNode, existingNodes) => {
  const originalPos = [...newNode.position];
  const dimensions = getNodeDimensions3D(newNode.visualStyle);
  const stepSize = Math.max(8 / 20, dimensions.width * 0.15);
  let spiralStep = 0;
  
  while (existingNodes.some(node => isColliding3D(
    { ...newNode, position: newNode.position },
    node
  ))) {
    spiralStep++;
    const angle = spiralStep * 0.5;
    const radius = stepSize * spiralStep / (2 * Math.PI);
    
    newNode.position[0] = originalPos[0] + radius * Math.cos(angle);
    newNode.position[1] = originalPos[1] + radius * Math.sin(angle);
  }
  
  return newNode.position;
};
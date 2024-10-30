import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';

// Dimension utilities
export const getNodeDimensions = (visualStyle) => {
  switch (visualStyle) {
    case 'compact':
      return { width: 40, height: 40 };
    case 'postit':
      return { width: 256, height: 256 };
    case 'default':
    default:
      return { width: 40, height: 128 };
  }
};

// Position utilities
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
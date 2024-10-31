export const mapNodeToView = (node, viewType) => {
  switch (viewType) {
    case 'mindmap':
      return {
        ...node,
        x: node.position_x || 0,
        y: node.position_y || 0,
        z: node.position_z || 0
      };
    case 'timeline':
      return {
        ...node,
        timestamp: node.metadata?.date || node.created_at,
        x: node.position_x || 0,
        y: 0,
        z: 0
      };
    case 'map':
      return {
        ...node,
        latitude: node.metadata?.latitude || 0,
        longitude: node.metadata?.longitude || 0,
        z: node.position_z || 0
      };
    default:
      return node;
  }
};

export const mapViewToNode = (viewData, viewType) => {
  switch (viewType) {
    case 'mindmap':
      return {
        position_x: viewData.x,
        position_y: viewData.y,
        position_z: viewData.z
      };
    case 'timeline':
      return {
        position_x: viewData.x,
        position_y: 0,
        position_z: 0,
        metadata: {
          ...viewData.metadata,
          date: viewData.timestamp
        }
      };
    case 'map':
      return {
        position_x: 0,
        position_y: 0,
        position_z: viewData.z,
        metadata: {
          ...viewData.metadata,
          latitude: viewData.latitude,
          longitude: viewData.longitude
        }
      };
    default:
      return viewData;
  }
};
export const NODE_STYLES = {
  compact: {
    width: 48,
    height: 48,
    title: "Compact Note",
    description: "A minimal note style showing only the avatar"
  },
  default: {
    width: 256,
    height: 48,
    title: "Default Note",
    description: "A standard note style with avatar and title"
  },
  postit: {
    width: 256,
    height: 256,
    title: "Post-it Note",
    description: "A larger note style with full content display"
  },
  cube: {
    width: 256,
    height: 256,
    title: "3D Cube",
    description: "A 3D cube node for spatial layouts"
  }
};

export const getNodeDimensions = (visualStyle) => {
  switch (visualStyle) {
    case 'compact':
      return { width: 48, height: 48 };
    case 'postit':
      return { width: 256, height: 256 };
    case 'default':
    default:
      return { width: 256, height: 48 };
  }
};
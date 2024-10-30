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
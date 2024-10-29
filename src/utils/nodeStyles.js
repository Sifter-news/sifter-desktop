export const NODE_STYLES = {
  compact: {
    width: 48,
    height: 48,
    resizable: false,
    label: "Compact"
  },
  default: {
    width: 128,
    height: 48,
    resizable: false,
    label: "Default"
  },
  postit: {
    width: 256,
    height: 256,
    resizable: true,
    label: "Post-it"
  }
};

export const getNodeDimensions = (visualStyle) => {
  return NODE_STYLES[visualStyle] || NODE_STYLES.default;
};
export const NODE_STYLES = {
  compact: {
    width: 48,
    height: 48,
    className: "rounded-full"
  },
  default: {
    width: 128,
    height: 48,
    className: "rounded-lg"
  },
  postit: {
    width: 256,
    height: 256,
    className: "rotate-1"
  }
};

export const getNodeDimensions = (visualStyle) => {
  return NODE_STYLES[visualStyle] || NODE_STYLES.default;
};
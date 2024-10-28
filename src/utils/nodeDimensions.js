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
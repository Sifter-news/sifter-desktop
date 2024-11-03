export const getNodeDimensions = (visualStyle) => {
  switch (visualStyle) {
    case 'compact':
      return { width: 48, height: 48 };
    case 'postit':
      return { width: 256, height: 256 };
    case 'default':
    default:
      return { width: 200, height: 100 };
  }
};
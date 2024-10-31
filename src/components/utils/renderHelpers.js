import { NODE_STYLES } from './nodeStyles';

export const getNodeDimensions = (visualStyle) => {
  const style = NODE_STYLES[visualStyle || 'default'];
  return {
    width: style?.width || 128,
    height: style?.height || 48,
    depth: visualStyle === 'cube' ? style?.width / 8 : 0.25
  };
};

export const getNodeStyle = (visualStyle, isHovered, isSelected) => {
  const baseStyle = "transition-all duration-200";
  const hoverStyle = isHovered ? "ring-1 ring-blue-300 ring-offset-1 shadow-md scale-[1.01]" : "";
  const selectedStyle = isSelected ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]" : "";
  
  return `${baseStyle} ${hoverStyle} ${selectedStyle}`;
};
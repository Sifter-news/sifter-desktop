/**
 * @file DefaultStyle.jsx
 * @description Standard style settings for general-purpose nodes
 * 
 * Potential improvements:
 * - Add more color themes
 * - Add custom border styles
 * - Add shadow options
 * - Add animation presets
 * - Add hover effects
 * - Add focus states
 * - Add accessibility improvements
 */

export const DefaultNodeStyle = {
  dimensions: {
    width: 200,
    height: 100,
    minWidth: 100,
    minHeight: 50,
    maxWidth: 400,
    maxHeight: 200
  },
  
  appearance: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    borderColor: 'gray-200',
    shadowSize: 'sm'
  },
  
  typography: {
    titleSize: 'text-lg',
    descriptionSize: 'text-sm',
    fontFamily: 'sans',
    lineHeight: 'normal'
  },
  
  states: {
    hover: {
      scale: 1.02,
      shadow: 'md',
      borderColor: 'blue-200'
    },
    selected: {
      scale: 1.05,
      shadow: 'lg',
      borderColor: 'blue-500'
    },
    dragging: {
      scale: 1.05,
      shadow: 'xl',
      opacity: 0.8
    }
  },
  
  animations: {
    duration: 200,
    timing: 'ease-in-out'
  }
};

export default DefaultNodeStyle;
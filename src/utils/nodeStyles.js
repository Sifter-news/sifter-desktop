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
    },
    colors: {
      yellow: "bg-yellow-100",
      blue: "bg-blue-100",
      green: "bg-green-100",
      pink: "bg-pink-100",
      white: "bg-white"
    },
    textSizes: {
      small: "text-xs",
      medium: "text-sm",
      large: "text-base"
    },
    textAlignments: {
      left: "text-left",
      center: "text-center"
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
    },
    colors: {
      yellow: "bg-yellow-100",
      blue: "bg-blue-100",
      green: "bg-green-100",
      pink: "bg-pink-100",
      white: "bg-white"
    },
    textSizes: {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
      huge: "text-xl"
    },
    textAlignments: {
      left: "text-left",
      center: "text-center"
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
    },
    colors: {
      yellow: "bg-yellow-100",
      blue: "bg-blue-100",
      green: "bg-green-100",
      pink: "bg-pink-100",
      orange: "bg-orange-100",
      purple: "bg-purple-100",
      white: "bg-white"
    },
    textSizes: {
      small: "text-base",
      medium: "text-lg",
      large: "text-xl",
      huge: "text-2xl",
      massive: "text-3xl"
    },
    textAlignments: {
      left: "text-left",
      center: "text-center"
    }
  },
  cube: {
    width: 256,
    height: 256,
    resizable: false,
    title: "3D Cube",
    description: "A 3D cube node for spatial layouts",
    display: {
      avatar: true,
      title: true,
      description: true
    },
    colors: {
      white: "bg-white",
      yellow: "bg-yellow-100",
      blue: "bg-blue-100",
      green: "bg-green-100",
      pink: "bg-pink-100"
    },
    textSizes: {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg"
    },
    textAlignments: {
      left: "text-left",
      center: "text-center"
    }
  }
};

export const getNodeDimensions = (visualStyle) => {
  return NODE_STYLES[visualStyle] || NODE_STYLES.default;
};

export const getNodeStyle = (visualStyle, color, textSize, textAlign) => {
  const style = NODE_STYLES[visualStyle] || NODE_STYLES.default;
  return {
    ...style,
    colorClass: style.colors[color] || style.colors.white,
    textSizeClass: style.textSizes[textSize] || style.textSizes.medium,
    textAlignClass: style.textAlignments[textAlign] || style.textAlignments.left
  };
};

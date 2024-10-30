import * as THREE from 'three';
import { NODE_STYLES } from './nodeStyles';

// Consolidated node dimension calculations
export const getNodeDimensions3D = (visualStyle) => {
  const style = NODE_STYLES[visualStyle || 'default'];
  return {
    width: (style.width || 256) / 16, // Doubled the divisor from 8 to 16
    height: (style.height || 256) / 16,
    depth: visualStyle === 'cube' ? (style.width || 256) / 16 : 0.25 // Halved the depth from 0.5
  };
};

// Consolidated position utilities
export const generateRandomPosition = () => ({
  x: (Math.random() * 100) - 50,
  y: (Math.random() * 100) - 50,
  z: 0
});

export const calculateCameraPosition = (viewMode, zoom) => {
  const distance = 200 / zoom;
  return viewMode === '3d' 
    ? [distance, distance, distance]
    : [0, 0, distance];
};

// Consolidated collision detection
export const isColliding3D = (node1, node2, buffer = 2) => {
  const dim1 = getNodeDimensions3D(node1.visualStyle);
  const dim2 = getNodeDimensions3D(node2.visualStyle);
  
  const pos1 = node1.position;
  const pos2 = node2.position;
  
  return Math.abs(pos1[0] - pos2[0]) < (dim1.width + dim2.width) / 2 + buffer &&
         Math.abs(pos1[1] - pos2[1]) < (dim1.height + dim2.height) / 2 + buffer &&
         Math.abs(pos1[2] - pos2[2]) < (dim1.depth + dim2.depth) / 2 + buffer;
};

// Consolidated material creation
export const createNodeMaterial = (isHovered, isHighlighted, visualStyle) => {
  return new THREE.MeshStandardMaterial({
    color: 'white',
    transparent: true,
    opacity: isHovered ? 0.8 : 1,
    side: visualStyle === 'cube' ? THREE.FrontSide : THREE.DoubleSide,
    emissive: isHighlighted ? "#ffffff" : "#000000",
    emissiveIntensity: isHighlighted ? 0.5 : 0
  });
};
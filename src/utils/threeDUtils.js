import * as THREE from 'three';
import { NODE_STYLES } from './nodeStyles';

export const getNodeDimensions3D = (visualStyle) => {
  const style = NODE_STYLES[visualStyle || 'default'];
  return {
    width: style.width / 16,
    height: style.height / 16,
    depth: visualStyle === 'cube' ? style.width / 16 : 0.25
  };
};

export const createNodeMaterial = (isHovered, isHighlighted, visualStyle) => {
  const color = visualStyle === 'postit' ? '#fef3c7' : '#ffffff';
  
  return new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: isHovered ? 0.8 : 1,
    side: THREE.DoubleSide,
    emissive: isHighlighted ? "#ffffff" : "#000000",
    emissiveIntensity: isHighlighted ? 0.5 : 0
  });
};

export const calculateCameraPosition = (viewMode, zoom) => {
  const distance = 200 / zoom;
  return viewMode === '3d' 
    ? [distance, distance, distance]
    : [0, 0, distance];
};
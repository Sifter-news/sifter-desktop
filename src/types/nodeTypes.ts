export type NodeType = 'person' | 'organization' | 'object' | 'concept' | 'location' | 'event';
export type NodeVisualType = 'compact' | 'default' | 'expanded' | 'expanded-doc';
export type NodeColor = 'yellow' | 'orange' | 'green';
export type TextAlignment = 'left' | 'center' | 'right';
export type TextSize = 'small' | 'medium' | 'large' | 'huge' | 'gigantic';

export interface Node {
  id: string;
  type: NodeType;
  visualType: NodeVisualType;
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: string;
  color: NodeColor;
  textSize: TextSize;
  textAlignment: TextAlignment;
  x: number;
  y: number;
  width: number;
  height: number;
}
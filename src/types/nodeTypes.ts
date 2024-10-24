export interface Node {
  id: string;
  type: 'node' | 'group';
  title: string;
  description: string;
  timestamp: number;
  latitude?: number;
  longitude?: number;
  children?: Node[];
}

export type NodeGroup = Node & { type: 'group'; children: Node[] };
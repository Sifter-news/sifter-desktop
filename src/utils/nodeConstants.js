import { FileText, User, Building2, Package, Brain, MapPin, Calendar, Layout, Square, StickyNote } from 'lucide-react';

export const NODE_TYPES = {
  note: { label: 'Note', icon: FileText, shortcut: 'N' },
  node_person: { label: 'Person', icon: User, shortcut: 'P' },
  node_organization: { label: 'Organization', icon: Building2, shortcut: 'O' },
  node_object: { label: 'Object', icon: Package, shortcut: 'B' },
  node_concept: { label: 'Concept', icon: Brain, shortcut: 'C' },
  node_location: { label: 'Location', icon: MapPin, shortcut: 'L' },
  node_event: { label: 'Event', icon: Calendar, shortcut: 'E' }
};

export const NODE_STYLES = {
  default: { label: 'Default', icon: Square },
  compact: { label: 'Compact', icon: Layout },
  postit: { label: 'Post-it', icon: StickyNote }
};

export const getNodeTypeIcon = (nodeType) => {
  return NODE_TYPES[nodeType]?.icon || FileText;
};

export const getNodeTypeLabel = (nodeType) => {
  return NODE_TYPES[nodeType]?.label || 'Note';
};
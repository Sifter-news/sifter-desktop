import { FileText, User, Building2, Package, Brain, MapPin, Calendar, Layout, Square, StickyNote } from 'lucide-react';

export const NODE_TYPES = {
  note: { label: 'Note', icon: FileText, shortcut: 'N' },
  person: { label: 'Person', icon: User, shortcut: 'P' },
  organization: { label: 'Organization', icon: Building2, shortcut: 'O' },
  object: { label: 'Object', icon: Package, shortcut: 'B' },
  concept: { label: 'Concept', icon: Brain, shortcut: 'C' },
  location: { label: 'Location', icon: MapPin, shortcut: 'L' },
  event: { label: 'Event', icon: Calendar, shortcut: 'E' }
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
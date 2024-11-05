import { 
  FileText, 
  User, 
  Building2, 
  Package, 
  Brain, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export const NODE_TYPES = {
  generic: { label: 'Generic Note', icon: FileText },
  node_person: { label: 'Person', icon: User },
  node_organization: { label: 'Organization', icon: Building2 },
  node_object: { label: 'Object', icon: Package },
  node_concept: { label: 'Concept', icon: Brain },
  node_location: { label: 'Location', icon: MapPin },
  node_event: { label: 'Event', icon: Calendar }
};

export const getNodeTypeIcon = (nodeType) => {
  return NODE_TYPES[nodeType]?.icon || FileText;
};

export const getNodeTypeLabel = (nodeType) => {
  return NODE_TYPES[nodeType]?.label || 'Generic Note';
};
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Layout, Type, Pencil, FileText, User, Building2, Package, Brain, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NodeEditDialog from './NodeEditDialog';
import { getNodeDimensions } from '@/utils/nodeDimensions';
import { handleNodeDelete } from '@/utils/nodeDeleteUtils';

const defaultStyles = {
  default: "Default",
  compact: "Compact",
  postit: "Post-it"
};

const defaultNodeTypes = {
  generic: { label: "Generic Note", icon: FileText },
  node_person: { label: "Person", icon: User },
  node_organization: { label: "Organization", icon: Building2 },
  node_object: { label: "Object", icon: Package },
  node_concept: { label: "Concept", icon: Brain },
  node_location: { label: "Location", icon: MapPin },
  node_event: { label: "Event", icon: Calendar }
};

const TooltipButtons = ({ 
  styles = defaultStyles, 
  nodeTypes = defaultNodeTypes, 
  handleStyleChange, 
  handleTypeChange, 
  onAIConversation, 
  onDelete,
  node,
  onUpdateNode
}) => {
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const currentStyle = node?.visualStyle || 'default';
  const currentType = node?.nodeType || 'generic';

  const CurrentTypeIcon = defaultNodeTypes[currentType]?.icon || FileText;

  const handleVisualStyleChange = (newStyle) => {
    const dimensions = getNodeDimensions(newStyle);
    const updates = {
      visualStyle: newStyle,
      width: dimensions.width,
      height: dimensions.height
    };
    onUpdateNode(node.id, updates);
    handleStyleChange?.(newStyle);
  };

  const handleNodeTypeChange = (newType) => {
    onUpdateNode(node.id, { nodeType: newType });
    handleTypeChange?.(newType);
  };

  return (
    <>
      <div className="flex items-center gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-blue-500/50 font-medium"
          onClick={() => setShowEditDialog(true)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <Separator orientation="vertical" className="bg-white/20 h-4" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Layout className="h-4 w-4 mr-2" />
              {defaultStyles[currentStyle]}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="flex flex-col space-y-1">
              {Object.entries(styles).map(([value, label]) => (
                <Button
                  key={value}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVisualStyleChange(value)}
                  className={`justify-start ${currentStyle === value ? 'bg-accent' : ''}`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="bg-white/20 h-4" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <CurrentTypeIcon className="h-4 w-4 mr-2" />
              {defaultNodeTypes[currentType]?.label || "Generic Note"}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col space-y-1">
              {Object.entries(defaultNodeTypes).map(([value, { label, icon: Icon }]) => (
                <Button
                  key={value}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNodeTypeChange(value)}
                  className={`justify-start ${currentType === value ? 'bg-accent' : ''}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="bg-white/20 h-4" />

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-red-700 bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            handleNodeDelete(node.id, onDelete);
          }}
        >
          Delete
        </Button>
      </div>

      <NodeEditDialog 
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        node={node}
        onUpdate={onUpdateNode}
        onDelete={onDelete}
      />
    </>
  );
};

export default TooltipButtons;

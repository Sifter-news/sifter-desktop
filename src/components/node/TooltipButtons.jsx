import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Layout, Type, Trash2, Pencil } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NodeEditDialog from './NodeEditDialog';

const defaultStyles = {
  default: "Default",
  compact: "Compact",
  expanded: "Expanded",
  postit: "Post-it"
};

const defaultNodeTypes = {
  generic: "Generic Note",
  node_person: "Person",
  node_organization: "Organization",
  node_object: "Object",
  node_concept: "Concept",
  node_location: "Location",
  node_event: "Event"
};

const TooltipButtons = ({ 
  styles = defaultStyles, 
  nodeTypes = defaultNodeTypes, 
  handleStyleChange, 
  handleTypeChange, 
  onAIConversation, 
  onDelete, 
  node,
  onUpdate
}) => {
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  // Ensure we have valid objects to iterate over
  const styleEntries = Object.entries(styles || defaultStyles);
  const typeEntries = Object.entries(nodeTypes || defaultNodeTypes);

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
              Style
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="flex flex-col space-y-1">
              {styleEntries.map(([value, label]) => (
                <Button
                  key={value}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStyleChange?.(value)}
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
              <Type className="h-4 w-4 mr-2" />
              Type
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col space-y-1">
              {typeEntries.map(([value, label]) => (
                <Button
                  key={value}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTypeChange?.(value)}
                >
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
          className="text-white hover:bg-purple-700 bg-purple-600"
          onClick={onAIConversation}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          AI
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-red-700"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <NodeEditDialog 
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        node={node}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default TooltipButtons;
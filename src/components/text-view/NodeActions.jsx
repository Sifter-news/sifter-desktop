import React from 'react';
import { Button } from "@/components/ui/button";
import { Layout, Type, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NodeEditModal from '../node/NodeEditModal';

const NodeActions = ({ node, onUpdateNode }) => {
  const [showEditModal, setShowEditModal] = React.useState(false);

  const styles = {
    default: "Default",
    compact: "Compact",
    expanded: "Expanded",
    postit: "Post-it"
  };

  const nodeTypes = {
    generic: "Generic Note",
    node_person: "Person",
    node_organization: "Organization",
    node_object: "Object",
    node_concept: "Concept",
    node_location: "Location",
    node_event: "Event"
  };

  const handleStyleChange = (style) => {
    onUpdateNode(node.id, { visualStyle: style });
  };

  const handleTypeChange = (type) => {
    onUpdateNode(node.id, { nodeType: type });
  };

  return (
    <>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Layout className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(styles).map(([value, label]) => (
              <DropdownMenuItem
                key={value}
                onClick={() => handleStyleChange(value)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Type className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(nodeTypes).map(([value, label]) => (
              <DropdownMenuItem
                key={value}
                onClick={() => handleTypeChange(value)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setShowEditModal(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <NodeEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        node={node}
        onUpdate={(updates) => {
          onUpdateNode(node.id, updates);
          setShowEditModal(false);
        }}
      />
    </>
  );
};

export default NodeActions;
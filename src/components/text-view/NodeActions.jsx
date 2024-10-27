import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Layout, 
  Search, 
  User, 
  Building2, 
  Package, 
  Brain, 
  MapPin, 
  Calendar,
  FileText,
  MoreVertical,
  MessageCircle,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NodeEditModal from '../node/NodeEditModal';

const NodeActions = ({ node, onUpdateNode, onAIConversation }) => {
  const [showEditModal, setShowEditModal] = React.useState(false);

  const styles = {
    default: "Default",
    compact: "Compact",
    expanded: "Expanded",
    postit: "Post-it"
  };

  const nodeTypes = {
    generic: { label: "Generic Note", icon: FileText },
    node_person: { label: "Person", icon: User },
    node_organization: { label: "Organization", icon: Building2 },
    node_object: { label: "Object", icon: Package },
    node_concept: { label: "Concept", icon: Brain },
    node_location: { label: "Location", icon: MapPin },
    node_event: { label: "Event", icon: Calendar }
  };

  const handleStyleChange = (style) => {
    onUpdateNode(node.id, { visualStyle: style });
  };

  const handleTypeChange = (type) => {
    onUpdateNode(node.id, { nodeType: type });
  };

  return (
    <>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setShowEditModal(true)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowEditModal(true)}>
              <Search className="h-4 w-4 mr-2" />
              Edit Node
            </DropdownMenuItem>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center px-2 py-1.5">
                  <Layout className="h-4 w-4 mr-2" />
                  Change Style
                </div>
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
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center px-2 py-1.5">
                  <Search className="h-4 w-4 mr-2" />
                  Change Type
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(nodeTypes).map(([value, { label, icon: Icon }]) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => handleTypeChange(value)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenuItem onClick={() => onAIConversation(node)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NodeEditModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        node={node}
        onUpdate={onUpdateNode}
      />
    </>
  );
};

export default NodeActions;
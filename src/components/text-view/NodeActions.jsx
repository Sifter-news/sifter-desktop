import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Layout, 
  User, 
  Building2, 
  Package, 
  Brain, 
  MapPin, 
  Calendar,
  FileText,
  MoreVertical,
  MessageCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NodeActions = ({ node, onUpdateNode, onAIConversation }) => {
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
    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
                <FileText className="h-4 w-4 mr-2" />
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

          <DropdownMenuItem onClick={() => onAIConversation(node)} className="bg-purple-600 hover:bg-purple-700 text-white focus:bg-purple-700 focus:text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NodeActions;
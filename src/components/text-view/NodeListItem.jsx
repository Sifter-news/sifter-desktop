import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getNodeTypeIcon } from './NodeTypeIcon';
import { Pencil, Trash2, MoreVertical, MessageCircle, Layout, FileText, User, Building2, Package, Brain, MapPin, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NodeListItem = ({ 
  node, 
  isSelected, 
  onSelect, 
  onFocus, 
  onUpdateNode, 
  onAIConversation,
  isFocused,
  onEdit,
  onDelete 
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!node) return null;

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

  const getNodeTypeLabel = (type) => {
    return nodeTypes[type]?.label || "Generic Note";
  };

  const handleDelete = () => {
    onDelete(node.id);
    setShowDeleteDialog(false);
  };

  const handleStyleChange = (style) => {
    onUpdateNode(node.id, { visualStyle: style });
  };

  const handleTypeChange = (type) => {
    onUpdateNode(node.id, { nodeType: type });
  };

  return (
    <>
      <div 
        className={`group flex items-center justify-between p-1 hover:bg-gray-100 rounded-lg mb-4 ${
          isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
        } ${isFocused ? 'ring-2 ring-blue-600' : ''}`}
        onClick={() => onSelect(node.id)}
      >
        <div 
          className="flex items-center flex-grow cursor-pointer gap-3"
          onClick={(e) => {
            e.stopPropagation();
            onFocus(node.id);
          }}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src="/default-image.png" alt={node.title} />
            <AvatarFallback>{getNodeTypeIcon(node.nodeType)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{node.title}</div>
            <div className="text-xs text-gray-500">{getNodeTypeLabel(node.nodeType)}</div>
            <div className="text-sm text-gray-500">
              {node.description}
              {node.type === 'group' && node.children && ` (${node.children.length} nodes)`}
            </div>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(node);
              }}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Layout className="h-4 w-4 mr-2" />
                  Change Style
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {Object.entries(styles).map(([value, label]) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => handleStyleChange(value)}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FileText className="h-4 w-4 mr-2" />
                  Change Type
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {Object.entries(nodeTypes).map(([value, { label, icon: Icon }]) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => handleTypeChange(value)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem 
                onClick={() => onAIConversation(node)} 
                className="bg-purple-600 hover:bg-purple-700 text-white focus:bg-purple-700 focus:text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Conversation
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this node?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the node and remove its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NodeListItem;
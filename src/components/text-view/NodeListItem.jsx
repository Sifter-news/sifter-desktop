import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GripVertical, Pencil, Trash2, MoreVertical, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDebug } from '@/contexts/DebugContext';
import UnifiedNodeEditModal from '../modals/ModalEdit_Node';
import { handleNodeDelete } from '@/utils/nodeDeleteUtils';
import { getNodeTypeIcon, getNodeTypeLabel } from '@/utils/nodeConstants';

const NodeListItem = ({ 
  node, 
  index,
  isSelected, 
  onSelect, 
  onFocus, 
  onUpdateNode, 
  onAIConversation = () => toast.error("AI Conversation not available"),
  isFocused,
  onDelete 
}) => {
  const { setHoveredElement } = useDebug();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const Icon = getNodeTypeIcon(node.nodeType);
  
  if (!node) return null;

  const handleMouseEnter = () => {
    setHoveredElement({
      component: 'NodeListItem',
      metadata: {
        id: node.id,
        type: node.nodeType || 'Generic Note',
        title: node.title,
        description: node.description,
        isSelected,
        isFocused
      }
    });
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group flex items-center justify-between py-2 px-3 rounded-lg mb-1 transition-all duration-200 cursor-pointer
          ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md' : 'hover:bg-gray-100'}
          ${isFocused ? 'ring-2 ring-blue-600' : ''}`}
        onClick={() => onSelect(node.id)}
      >
        <div className="flex items-center gap-2 flex-grow transition-all">
          <div className="w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 overflow-hidden cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          
          <div 
            className="flex items-center flex-grow gap-3"
            onClick={(e) => {
              e.stopPropagation();
              onFocus(node.id);
            }}
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={node.avatar || "/default-image.png"} alt={node.title} />
              <AvatarFallback><Icon className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div>
              <div className={`font-medium text-sm ${isSelected ? 'text-blue-700' : ''}`}>
                {node.title}
              </div>
              <div className="text-xs text-gray-500">
                {getNodeTypeLabel(node.nodeType)}
              </div>
            </div>
          </div>
        </div>

        <NodeListItemActions 
          node={node}
          onEdit={() => setShowEditModal(true)}
          onDelete={onDelete}
          onAIConversation={onAIConversation}
        />
      </div>

      <UnifiedNodeEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        node={node}
        onUpdate={onUpdateNode}
        onDelete={onDelete}
        onAIConversation={onAIConversation}
      />
    </>
  );
};

export default NodeListItem;
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GripVertical } from 'lucide-react';
import { useDebug } from '@/contexts/DebugContext';
import UnifiedNodeEditModal from '../modals/ModalEdit_Node';
import { getNodeTypeIcon, getNodeTypeLabel } from '@/utils/nodeConstants';
import NodeListItemActions from '../nodes/shared/NodeListItemActions';

const NodeListItem = ({ 
  node, 
  index,
  isSelected,
  onSelect,
  onFocus,
  onUpdateNode,
  onAIConversation,
  isFocused,
  onDelete
}) => {
  const { setHoveredElement } = useDebug();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const Icon = getNodeTypeIcon(node.nodeType);
  
  if (!node) return null;

  const handleMouseEnter = () => {
    setHoveredElement({
      type: 'node',
      id: node.id,
      title: node.title
    });
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  return (
    <div
      className={`
        group flex items-center justify-between p-2 rounded-lg cursor-pointer
        ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
      `}
      onClick={() => onSelect(node.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="cursor-grab">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        <div className="ml-2 flex items-center space-x-3 flex-1 min-w-0">
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

      <UnifiedNodeEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        node={node}
        onUpdate={onUpdateNode}
        onDelete={onDelete}
      />
    </div>
  );
};

export default NodeListItem;
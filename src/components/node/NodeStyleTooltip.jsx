import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Layout, Type, MessageCircle, Pencil, ChevronDown, Square, StickyNote } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UnifiedNodeEditModal from '../modals/ModalEdit_Node';

const colors = {
  white: { label: 'White', class: 'bg-white' },
  yellow: { label: 'Yellow', class: 'bg-yellow-100' },
  blue: { label: 'Blue', class: 'bg-blue-100' },
  green: { label: 'Green', class: 'bg-green-100' },
  pink: { label: 'Pink', class: 'bg-pink-100' },
  purple: { label: 'Purple', class: 'bg-purple-100' },
  orange: { label: 'Orange', class: 'bg-orange-100' },
};

const styles = {
  default: { label: 'Default', icon: Square },
  compact: { label: 'Compact', icon: Layout },
  postit: { label: 'Post-it', icon: StickyNote }
};

const nodeTypes = {
  generic: { label: 'Note', icon: Type },
  node_person: { label: 'Person', icon: Type },
  node_organization: { label: 'Organization', icon: Type },
  node_object: { label: 'Object', icon: Type },
  node_concept: { label: 'Concept', icon: Type },
  node_location: { label: 'Location', icon: Type },
  node_event: { label: 'Event', icon: Type }
};

const NodeStyleTooltip = ({
  position,
  onStyleChange,
  onTextSizeChange,
  onAlignmentChange,
  onTypeChange,
  onColorChange,
  onEdit,
  onAIChat,
  node,
  onUpdateNode,
  onDelete
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  
  const currentColor = node?.color || 'bg-white';
  const currentStyle = node?.visualStyle || 'default';
  const currentType = node?.nodeType || 'generic';
  
  const CurrentStyleIcon = styles[currentStyle]?.icon || Square;
  const CurrentTypeIcon = nodeTypes[currentType]?.icon || Type;
  
  return (
    <>
      <div 
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg shadow-lg"
        style={{ zIndex: 'auto' }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={() => setShowEditModal(true)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <Popover open={colorMenuOpen} onOpenChange={setColorMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <div className={`w-4 h-4 rounded-full mr-2 ${currentColor}`} />
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="flex flex-col space-y-1">
              {Object.entries(colors).map(([key, { label, class: bgClass }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onColorChange(bgClass);
                    setColorMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  <div className={`w-4 h-4 rounded-full mr-2 ${bgClass}`} />
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={styleMenuOpen} onOpenChange={setStyleMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <CurrentStyleIcon className="h-4 w-4 mr-2" />
              {styles[currentStyle]?.label}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="flex flex-col space-y-1">
              {Object.entries(styles).map(([key, { label, icon: Icon }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onStyleChange(key);
                    setStyleMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={typeMenuOpen} onOpenChange={setTypeMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <CurrentTypeIcon className="h-4 w-4 mr-2" />
              {nodeTypes[currentType]?.label}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col space-y-1">
              {Object.entries(nodeTypes).map(([key, { label, icon: Icon }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onTypeChange(key);
                    setTypeMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-purple-700 bg-purple-600"
          onClick={onAIChat}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          AI
        </Button>
      </div>

      <UnifiedNodeEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        node={node}
        onUpdate={onUpdateNode}
        onDelete={onDelete}
      />
    </>
  );
};

export default NodeStyleTooltip;
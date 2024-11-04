import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Layout, 
  MessageCircle, 
  Pencil, 
  ChevronDown, 
  Square, 
  StickyNote,
  FileText,
  User,
  Building2,
  Box,
  Brain,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UnifiedNodeEditModal from '../modals/ModalEdit_Node';

const colors = {
  white: { label: 'Pure White', class: 'bg-white' },
  offwhite: { label: 'Off White', class: 'bg-gray-50' },
  yellow: { label: 'Yellow', class: 'bg-yellow-100' },
  blue: { label: 'Blue', class: 'bg-blue-100' },
  green: { label: 'Green', class: 'bg-green-100' },
  pink: { label: 'Pink', class: 'bg-pink-100' },
  purple: { label: 'Purple', class: 'bg-purple-100' },
  orange: { label: 'Orange', class: 'bg-orange-100' },
};

const styles = {
  compact: { label: 'Compact', icon: Layout },
  default: { label: 'Default', icon: Square },
  postit: { label: 'Post-it', icon: StickyNote }
};

const nodeTypes = {
  generic: { label: 'Note', icon: FileText },
  node_person: { label: 'Person', icon: User },
  node_organization: { label: 'Organization', icon: Building2 },
  node_object: { label: 'Object', icon: Box },
  node_concept: { label: 'Concept', icon: Brain },
  node_location: { label: 'Location', icon: MapPin },
  node_event: { label: 'Event', icon: Calendar }
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
  const CurrentTypeIcon = nodeTypes[currentType]?.icon || FileText;

  const handleColorChange = (colorClass) => {
    onColorChange(colorClass);
    setColorMenuOpen(false);
  };
  
  return (
    <>
      <div 
        className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center gap-1 p-1.5 bg-black rounded-lg shadow-lg"
        style={{ zIndex: 'auto' }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 h-7 px-2"
          onClick={() => setShowEditModal(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Popover open={colorMenuOpen} onOpenChange={setColorMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 px-2">
              <div className={`w-4 h-4 rounded-full ${currentColor} ring-1 ring-white/30`} />
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="flex flex-col space-y-0.5">
              {Object.entries(colors).map(([key, { label, class: bgClass }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleColorChange(bgClass)}
                  className="justify-start h-7"
                >
                  <div className={`w-4 h-4 rounded-full mr-2 ${bgClass} ring-1 ring-black/10`} />
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={styleMenuOpen} onOpenChange={setStyleMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 px-2">
              <CurrentStyleIcon className="h-4 w-4" />
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="flex flex-col space-y-0.5">
              {Object.entries(styles).map(([key, { label, icon: Icon }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onStyleChange(key);
                    setStyleMenuOpen(false);
                  }}
                  className="justify-start h-7"
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
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 px-2">
              <CurrentTypeIcon className="h-4 w-4" />
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col space-y-0.5">
              {Object.entries(nodeTypes).map(([key, { label, icon: Icon }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onTypeChange(key);
                    setTypeMenuOpen(false);
                  }}
                  className="justify-start h-7"
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
          className="text-white hover:bg-purple-700 bg-purple-600 h-7 px-2"
          onClick={onAIChat}
        >
          <MessageCircle className="h-4 w-4" />
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
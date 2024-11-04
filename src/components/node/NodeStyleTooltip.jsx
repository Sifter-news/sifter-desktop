import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Layout,
  Type,
  MessageCircle,
  FileText,
  User,
  Building2,
  Package,
  Brain,
  MapPin,
  Calendar,
  AlignLeft,
  AlignCenter,
  Palette
} from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TooltipButton from './tooltips/TooltipButton';
import TooltipDropdownContent from './tooltips/TooltipDropdownContent';

const textSizes = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  huge: "Huge"
};

const colors = {
  white: { label: 'White', value: 'bg-white' },
  yellow: { label: 'Yellow', value: 'bg-yellow-100' },
  blue: { label: 'Blue', value: 'bg-blue-100' },
  green: { label: 'Green', value: 'bg-green-100' },
  pink: { label: 'Pink', value: 'bg-pink-100' },
  purple: { label: 'Purple', value: 'bg-purple-100' },
  orange: { label: 'Orange', value: 'bg-orange-100' },
};

const NodeStyleTooltip = ({ 
  onStyleChange, 
  onTextSizeChange, 
  onAlignmentChange,
  onTypeChange,
  onAIChat,
  onColorChange,
  position = { x: 0, y: 0 },
  currentStyle = 'default',
  currentTextSize = 'medium',
  currentAlignment = 'left',
  currentType = 'generic',
  currentColor = 'bg-white'
}) => {
  const nodeTypes = {
    generic: { label: "Generic Note", icon: FileText },
    node_person: { label: "Person", icon: User },
    node_organization: { label: "Organization", icon: Building2 },
    node_object: { label: "Object", icon: Package },
    node_concept: { label: "Concept", icon: Brain },
    node_location: { label: "Location", icon: MapPin },
    node_event: { label: "Event", icon: Calendar }
  };

  const CurrentTypeIcon = nodeTypes[currentType]?.icon || FileText;

  return (
    <div 
      className="absolute bg-black/90 backdrop-blur-sm rounded-lg shadow-lg p-2 flex gap-1 z-50"
      style={{ 
        left: '50%',
        bottom: '100%',
        transform: 'translateX(-50%)',
        marginBottom: '8px'
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipButton icon={Type} />
        </DropdownMenuTrigger>
        <TooltipDropdownContent 
          items={Object.entries(textSizes).map(([size, label]) => ({
            key: size,
            label,
            value: size
          }))}
          onSelect={onTextSizeChange}
          currentValue={currentTextSize}
        />
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipButton 
            icon={currentAlignment === 'left' ? AlignLeft : AlignCenter}
          />
        </DropdownMenuTrigger>
        <TooltipDropdownContent 
          items={[
            { key: 'left', label: 'Left', value: 'left', icon: AlignLeft },
            { key: 'center', label: 'Center', value: 'center', icon: AlignCenter }
          ]}
          onSelect={onAlignmentChange}
          currentValue={currentAlignment}
        />
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipButton icon={Layout} />
        </DropdownMenuTrigger>
        <TooltipDropdownContent 
          items={[
            { key: 'default', label: 'Default', value: 'default', icon: Layout },
            { key: 'compact', label: 'Compact', value: 'compact', icon: Layout },
            { key: 'postit', label: 'Post-it', value: 'postit', icon: Layout }
          ]}
          onSelect={onStyleChange}
          currentValue={currentStyle}
        />
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipButton icon={CurrentTypeIcon} />
        </DropdownMenuTrigger>
        <TooltipDropdownContent 
          items={Object.entries(nodeTypes).map(([type, { label, icon }]) => ({
            key: type,
            label,
            value: type,
            icon
          }))}
          onSelect={onTypeChange}
          currentValue={currentType}
        />
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipButton icon={Palette} />
        </DropdownMenuTrigger>
        <TooltipDropdownContent 
          items={Object.entries(colors).map(([key, { label, value }]) => ({
            key,
            label,
            value,
            component: <div className={`w-4 h-4 rounded ${value}`} />
          }))}
          onSelect={onColorChange}
          currentValue={currentColor}
        />
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white"
        onClick={onAIChat}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default NodeStyleTooltip;
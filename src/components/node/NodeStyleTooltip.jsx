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
  ChevronDown,
  AlignLeft,
  AlignCenter,
  Palette
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          <Button variant="ghost" size="sm" className="h-8 w-8 text-white hover:bg-white/10">
            <Type className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black text-white border-white/10">
          {Object.entries(textSizes).map(([size, label]) => (
            <DropdownMenuItem 
              key={size} 
              onClick={() => onTextSizeChange(size)}
              className={`${currentTextSize === size ? 'bg-white/10' : ''} hover:bg-white/20`}
            >
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 text-white hover:bg-white/10">
            {currentAlignment === 'left' ? <AlignLeft className="h-4 w-4" /> : <AlignCenter className="h-4 w-4" />}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black text-white border-white/10">
          <DropdownMenuItem 
            onClick={() => onAlignmentChange('left')}
            className={`${currentAlignment === 'left' ? 'bg-white/10' : ''} hover:bg-white/20`}
          >
            <AlignLeft className="h-4 w-4 mr-2" /> Left
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onAlignmentChange('center')}
            className={`${currentAlignment === 'center' ? 'bg-white/10' : ''} hover:bg-white/20`}
          >
            <AlignCenter className="h-4 w-4 mr-2" /> Center
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 text-white hover:bg-white/10">
            <Layout className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black text-white border-white/10">
          <DropdownMenuItem 
            onClick={() => onStyleChange('default')}
            className={`${currentStyle === 'default' ? 'bg-white/10' : ''} hover:bg-white/20`}
          >
            <Layout className="h-4 w-4 mr-2" /> Default
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onStyleChange('compact')}
            className={`${currentStyle === 'compact' ? 'bg-white/10' : ''} hover:bg-white/20`}
          >
            <Layout className="h-4 w-4 mr-2" /> Compact
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onStyleChange('postit')}
            className={`${currentStyle === 'postit' ? 'bg-white/10' : ''} hover:bg-white/20`}
          >
            <Layout className="h-4 w-4 mr-2" /> Post-it
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 text-white hover:bg-white/10">
            <CurrentTypeIcon className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black text-white border-white/10">
          {Object.entries(nodeTypes).map(([type, { label, icon: Icon }]) => (
            <DropdownMenuItem 
              key={type} 
              onClick={() => onTypeChange(type)}
              className={`${currentType === type ? 'bg-white/10' : ''} hover:bg-white/20`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 text-white hover:bg-white/10">
            <Palette className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black text-white border-white/10">
          {Object.entries(colors).map(([key, { label, value }]) => (
            <DropdownMenuItem 
              key={key} 
              onClick={() => onColorChange(value)}
              className={`flex items-center gap-2 ${currentColor === value ? 'bg-white/10' : ''} hover:bg-white/20`}
            >
              <div className={`w-4 h-4 rounded ${value}`} />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white"
        onClick={onAIChat}
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NodeStyleTooltip;
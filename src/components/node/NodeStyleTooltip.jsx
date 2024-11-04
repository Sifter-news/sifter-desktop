import React from 'react';
import { Button } from "@/components/ui/button";
import {
  AlignCenter,
  AlignLeft,
  Type,
  Layout,
  FileText,
  User,
  Building2,
  Package,
  Brain,
  MapPin,
  Calendar,
  MessageCircle,
  ChevronDown,
  Square,
  StickyNote,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const textSizes = {
  small: { label: "Small", class: "text-sm" },
  medium: { label: "Medium", class: "text-base" },
  large: { label: "Large", class: "text-lg" },
  huge: { label: "Huge", class: "text-xl" }
};

const colors = {
  white: { label: 'White', value: 'bg-white', textColor: 'text-black' },
  yellow: { label: 'Yellow', value: 'bg-yellow-100', textColor: 'text-black' },
  blue: { label: 'Blue', value: 'bg-blue-100', textColor: 'text-black' },
  green: { label: 'Green', value: 'bg-green-100', textColor: 'text-black' },
  pink: { label: 'Pink', value: 'bg-pink-100', textColor: 'text-black' },
  purple: { label: 'Purple', value: 'bg-purple-100', textColor: 'text-black' },
  orange: { label: 'Orange', value: 'bg-orange-100', textColor: 'text-black' },
};

const styles = {
  default: { label: 'Default', icon: Layout, dimensions: '200×100' },
  compact: { label: 'Compact', icon: Square, dimensions: '48×48' },
  postit: { label: 'Post-it', icon: StickyNote, dimensions: '256×256' }
};

const NodeStyleTooltip = ({ 
  onStyleChange, 
  onTextSizeChange, 
  onAlignmentChange,
  onTypeChange,
  onAIChat,
  onColorChange,
  position = { x: 0, y: 0 },
  selectedTextSize = 'medium',
  selectedColor = 'bg-white',
  selectedAlignment = 'left',
  selectedStyle = 'default'
}) => {
  return (
    <div 
      className="absolute bg-black/90 rounded-lg shadow-lg p-2 flex gap-1 z-50"
      style={{ 
        left: '50%',
        bottom: '100%',
        transform: 'translateX(-50%)',
        marginBottom: '8px'
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-10 w-10 text-white hover:bg-white/10 flex items-center gap-1">
            <div className={`w-6 h-6 rounded ${selectedColor}`} />
            <ChevronDown className="h-3 w-3 text-white/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 text-white border-white/10">
          {Object.entries(colors).map(([key, { label, value, textColor }]) => (
            <DropdownMenuItem 
              key={key} 
              onClick={() => onColorChange(value)}
              className="flex items-center gap-2"
            >
              <div className={`w-4 h-4 rounded ${value}`} />
              <span className={value === selectedColor ? 'font-bold' : ''}>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-10 w-10 text-white hover:bg-white/10 flex items-center gap-1">
            <Type className="h-6 w-6" />
            <ChevronDown className="h-3 w-3 text-white/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 text-white border-white/10">
          {Object.entries(textSizes).map(([size, { label, class: sizeClass }]) => (
            <DropdownMenuItem 
              key={size} 
              onClick={() => onTextSizeChange(size)}
              className={`${sizeClass} ${size === selectedTextSize ? 'font-bold' : ''}`}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-10 w-10 text-white hover:bg-white/10 flex items-center gap-1">
            {selectedAlignment === 'left' ? (
              <AlignLeft className="h-6 w-6" />
            ) : (
              <AlignCenter className="h-6 w-6" />
            )}
            <ChevronDown className="h-3 w-3 text-white/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 text-white border-white/10">
          <DropdownMenuItem onClick={() => onAlignmentChange('left')}>
            <AlignLeft className="h-6 w-6 mr-2" />
            Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAlignmentChange('center')}>
            <AlignCenter className="h-6 w-6 mr-2" />
            Center
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-10 w-10 text-white hover:bg-white/10 flex items-center gap-1">
            {React.createElement(styles[selectedStyle].icon, { className: "h-6 w-6" })}
            <ChevronDown className="h-3 w-3 text-white/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 text-white border-white/10">
          {Object.entries(styles).map(([value, { label, icon: Icon, dimensions }]) => (
            <DropdownMenuItem 
              key={value} 
              onClick={() => onStyleChange(value)}
              className="flex items-center gap-2"
            >
              <Icon className="h-6 w-6 mr-2" />
              <span className={value === selectedStyle ? 'font-bold' : ''}>
                {label} ({dimensions})
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-10 w-10 text-white hover:bg-white/10 flex items-center gap-1">
            <FileText className="h-6 w-6" />
            <ChevronDown className="h-3 w-3 text-white/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 text-white border-white/10">
          <DropdownMenuItem onClick={() => onTypeChange('generic')}>
            <FileText className="h-6 w-6 mr-2" /> Generic Note
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_person')}>
            <User className="h-6 w-6 mr-2" /> Person
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_organization')}>
            <Building2 className="h-6 w-6 mr-2" /> Organization
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_object')}>
            <Package className="h-6 w-6 mr-2" /> Object
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_concept')}>
            <Brain className="h-6 w-6 mr-2" /> Concept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_location')}>
            <MapPin className="h-6 w-6 mr-2" /> Location
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_event')}>
            <Calendar className="h-6 w-6 mr-2" /> Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-10 w-10 text-white hover:bg-purple-500/50 bg-purple-500/25"
        onClick={onAIChat}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default NodeStyleTooltip;
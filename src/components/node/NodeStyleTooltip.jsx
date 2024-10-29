import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  Pencil,
  MessageCircle,
  Palette
} from 'lucide-react';

const textSizes = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  huge: "text-xl"
};

const nodeColors = {
  white: "bg-white",
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  blue: "bg-blue-100"
};

const NodeStyleTooltip = ({ 
  onStyleChange, 
  onTextSizeChange, 
  onAlignmentChange,
  onTypeChange,
  onColorChange,
  onEdit,
  onAIChat,
  position = { x: 0, y: 0 } 
}) => {
  return (
    <div 
      className="absolute bg-white rounded-lg shadow-lg p-2 flex gap-1 z-50"
      style={{ 
        left: position.x,
        top: position.y - 8, // 8px above the node
        transform: 'translateY(-100%)' 
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <Type className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(textSizes).map(([size, className]) => (
            <DropdownMenuItem key={size} onClick={() => onTextSizeChange(size)}>
              <span className={className}>Text {size}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <AlignLeft className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onAlignmentChange('left')}>
            <AlignLeft className="h-4 w-4 mr-2" /> Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAlignmentChange('center')}>
            <AlignCenter className="h-4 w-4 mr-2" /> Center
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <Layout className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStyleChange('default')}>
            <Layout className="h-4 w-4 mr-2" /> Default
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStyleChange('compact')}>
            <Layout className="h-4 w-4 mr-2" /> Compact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStyleChange('postit')}>
            <Layout className="h-4 w-4 mr-2" /> Post-it
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <FileText className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onTypeChange('generic')}>
            <FileText className="h-4 w-4 mr-2" /> Generic
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_person')}>
            <User className="h-4 w-4 mr-2" /> Person
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_organization')}>
            <Building2 className="h-4 w-4 mr-2" /> Organization
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_object')}>
            <Package className="h-4 w-4 mr-2" /> Object
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_concept')}>
            <Brain className="h-4 w-4 mr-2" /> Concept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_location')}>
            <MapPin className="h-4 w-4 mr-2" /> Location
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_event')}>
            <Calendar className="h-4 w-4 mr-2" /> Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(nodeColors).map(([color, className]) => (
            <DropdownMenuItem 
              key={color} 
              onClick={() => onColorChange(color)}
              className={className}
            >
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenuSeparator />

      <Button variant="ghost" size="sm" className="h-8 w-8" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 bg-purple-100 hover:bg-purple-200" 
        onClick={onAIChat}
      >
        <MessageCircle className="h-4 w-4 text-purple-600" />
      </Button>
    </div>
  );
};

export default NodeStyleTooltip;
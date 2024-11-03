import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  MessageCircle,
} from 'lucide-react';

const textSizes = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  huge: "text-xl"
};

const NodeStyleTooltip = ({ 
  onStyleChange, 
  onTextSizeChange, 
  onAlignmentChange,
  onTypeChange,
  onAIChat,
  position = { x: 0, y: 0 } 
}) => {
  return (
    <div 
      className="absolute bg-white rounded-lg shadow-lg p-2 flex gap-1 z-50"
      style={{ 
        left: position.x,
        top: position.y - 8,
        transform: 'translateY(-100%)' 
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <Type className="h-5 w-5" />
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
            <AlignLeft className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onAlignmentChange('left')}>
            <AlignLeft className="h-5 w-5 mr-2" /> Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAlignmentChange('center')}>
            <AlignCenter className="h-5 w-5 mr-2" /> Center
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <Layout className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStyleChange('default')}>
            <Layout className="h-5 w-5 mr-2" /> Default
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStyleChange('compact')}>
            <Layout className="h-5 w-5 mr-2" /> Compact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStyleChange('postit')}>
            <Layout className="h-5 w-5 mr-2" /> Post-it
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <FileText className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onTypeChange('generic')}>
            <FileText className="h-5 w-5 mr-2" /> Generic
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_person')}>
            <User className="h-5 w-5 mr-2" /> Person
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_organization')}>
            <Building2 className="h-5 w-5 mr-2" /> Organization
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_object')}>
            <Package className="h-5 w-5 mr-2" /> Object
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_concept')}>
            <Brain className="h-5 w-5 mr-2" /> Concept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_location')}>
            <MapPin className="h-5 w-5 mr-2" /> Location
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange('node_event')}>
            <Calendar className="h-5 w-5 mr-2" /> Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 bg-purple-100 hover:bg-purple-200" 
        onClick={onAIChat}
      >
        <MessageCircle className="h-5 w-5 text-purple-600" />
      </Button>
    </div>
  );
};

export default NodeStyleTooltip;
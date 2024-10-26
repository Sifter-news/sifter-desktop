import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Type, 
  Trash2, 
  User, 
  Building, 
  Box, 
  Lightbulb,
  MapPin, 
  Calendar,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NodeRenderer = ({ 
  node, 
  onDragStart, 
  zoom, 
  onNodeUpdate, 
  onFocus, 
  isFocused, 
  onDelete 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getNodeIcon = (type) => {
    switch (type) {
      case 'person': return <User className="h-4 w-4" />;
      case 'organization': return <Building className="h-4 w-4" />;
      case 'object': return <Box className="h-4 w-4" />;
      case 'concept': return <Lightbulb className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      default: return <Box className="h-4 w-4" />;
    }
  };

  const getNodeContent = () => {
    const baseClasses = cn(
      "p-4 transition-all duration-200",
      node.color === 'yellow' && 'bg-yellow-200',
      node.color === 'orange' && 'bg-orange-200',
      node.color === 'green' && 'bg-green-200',
      `text-${node.textAlignment}`,
      {
        'text-sm': node.textSize === 'small',
        'text-base': node.textSize === 'medium',
        'text-lg': node.textSize === 'large',
        'text-xl': node.textSize === 'huge',
        'text-2xl': node.textSize === 'gigantic',
      }
    );

    switch (node.visualType) {
      case 'compact':
        return (
          <div className={cn(baseClasses, "rounded-full w-12 h-12 flex items-center justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gray-200" />
          </div>
        );
      case 'default':
        return (
          <div className={cn(baseClasses, "rounded-full flex items-center space-x-2")}>
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <h3 className="font-medium">{node.title}</h3>
              {node.subtitle && <p className="text-sm text-gray-600">{node.subtitle}</p>}
            </div>
          </div>
        );
      case 'expanded':
      case 'expanded-doc':
        return (
          <div className={cn(baseClasses, "rounded-lg")}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <h3 className="font-medium">{node.title}</h3>
                {node.subtitle && <p className="text-sm text-gray-600">{node.subtitle}</p>}
              </div>
            </div>
            {node.description && <p className="mt-2">{node.description}</p>}
            {node.visualType === 'expanded-doc' && (
              <div className="mt-4 h-32 bg-gray-100 rounded flex items-center justify-center">
                Document Preview
              </div>
            )}
          </div>
        );
    }
  };

  const handleUpdate = (updates) => {
    onNodeUpdate(node.id, { ...node, ...updates });
  };

  return (
    <Rnd
      size={{ width: node.width, height: node.height }}
      position={{ x: node.x, y: node.y }}
      onDragStart={(e) => onDragStart(e, node.id)}
      scale={zoom}
      className="group relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {getNodeContent()}
      
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white rounded-lg shadow-lg p-2 flex items-center space-x-2 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleUpdate({ visualType: 'compact' })}>
                  Compact View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ visualType: 'default' })}>
                  Default View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ visualType: 'expanded' })}>
                  Expanded View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ visualType: 'expanded-doc' })}>
                  Document View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ color: 'yellow' })}>
                  Yellow
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ color: 'orange' })}>
                  Orange
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ color: 'green' })}>
                  Green
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ textAlignment: 'left' })}>
                  <AlignLeft className="mr-2 h-4 w-4" /> Left Align
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ textAlignment: 'center' })}>
                  <AlignCenter className="mr-2 h-4 w-4" /> Center Align
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate({ textAlignment: 'right' })}>
                  <AlignRight className="mr-2 h-4 w-4" /> Right Align
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(node.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Node
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Rnd>
  );
};

export default NodeRenderer;